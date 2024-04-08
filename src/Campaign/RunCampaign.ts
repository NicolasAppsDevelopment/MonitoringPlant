import { sqlConnections } from '../Database/DatabaseManager';
import {tcpConnection} from "../Tcp/TcpManager";
import { logger } from "../Logger/LoggerManager";
import { sleep, sleepUntilWhileRunning } from "../Helper/sleep";
import { TcpDaemonAnswerError } from '../Tcp/TcpDaemonMessageTypes';
import Calibration from './Calibration';
import { SensorStates } from './SensorStatesType';
import { CampaignStateLevelCode, LogLevelCode } from '../Database/LevelCode';

/**
 * Class that handle the running of a campaign.
 */
export default class RunCampaign {
    private currentCampaignId: number;

    /**
     * @param numberOfMeasureLeft - the number of measure to register in the database before the end of the campaign
     */
    private numberOfMeasureLeft: number;

    /**
     * @param interval - the interval between two measurements in milliseconds
     */
    private interval: number;

    /**
     * @param nbReset - number of reset of the module (max 2, if more, the campaign will stop)
     * Incremented in case of error while getting measure
     */
    private nbReset: number;
    private isCampaignRunning: boolean;
    private sensorStates: SensorStates;

    constructor() {
        this.currentCampaignId = -1;
        this.numberOfMeasureLeft = -1;
        this.interval = -1;
        this.nbReset = 0;
        this.isCampaignRunning = false;
    
        this.sensorStates = {
            o2: false,
            co2: false,
            humidity: false,
            luminosity: false,
            temperature: false
        };

        this.stopAllCampaigns();
    }

    /**
     * Initialises and starts a campaign runner with parameters retrieved from the database from a specific campaign id.
     * @param currentCampaignId number - id of the campaign to start
     */
    async initCampaign(campaignId:number){
        if(this.isCampaignRunning){
            throw new Error("Une campagne est déjà en cours d'éxecution.");
        }

        const campaignData = await sqlConnections.getCampaignInfo(campaignId);

        if (campaignData.idConfig == null) {
            throw new Error("La campagne n'a pas de configuration de calibration associée.")
        }

        await sqlConnections.setAlertLevel(campaignId, CampaignStateLevelCode.SUCCESS);
        await sqlConnections.setFinished(campaignId, false);

        this.sensorStates = {
            o2: campaignData.O2SensorState,
            co2: campaignData.CO2SensorState,
            humidity: campaignData.humiditySensorState,
            luminosity: campaignData.luminositySensorState,
            temperature: campaignData.temperatureSensorState
        };

        this.currentCampaignId = campaignId;
        this.numberOfMeasureLeft = campaignData.duration / campaignData.interval_;
        this.interval = campaignData.interval_ * 1000;
        this.nbReset = 0;
        this.isCampaignRunning = true;

        // set the configuration of the module and reset it
        let calibration = new Calibration();
        await calibration.initCalibration(campaignData.idConfig, campaignId);
        await tcpConnection.calibrateModule(calibration);
        await tcpConnection.resetModule();

        this.runCampaign();
    }

    getCurrentCampaignId():number{
        return this.currentCampaignId;
    }

    isRunning(): boolean {
        return this.isCampaignRunning;
    }

    /**
     * Loop where the campaign will register the sensor data in the database and handle potential errors.
     */
    async runCampaign() {
        try {
            await sqlConnections.insertLogs(this.currentCampaignId, LogLevelCode.PROCESSING, "Initialisation", "Le module de mesure est en cours d'initialisation... Cette opération prend entre 20 et 40 secondes.");

            if (await this.waitUntilReady()) {
                await sqlConnections.insertLogs(this.currentCampaignId, LogLevelCode.SUCCESS, "Campagne démarrée", "Le module de mesure a bien été initialisé et la campagne a été démarrée avec succès.");
            }

            let nextLoopMillis: number = new Date().getTime();
            while (this.numberOfMeasureLeft >= 0 && this.isCampaignRunning) {
                nextLoopMillis += this.interval;
                this.numberOfMeasureLeft--;

                try {
                    const data = await tcpConnection.getMeasure();
                    await sqlConnections.insertMeasure(this.currentCampaignId, data, this.sensorStates);
                    this.nbReset = 0;
                } catch (error) {
                    logger.error("runCampaign: error while getting measure. " + error);

                    if(this.nbReset >= 2){
                        throw new Error("La campagne a été intérrompu après l'échec de plusieurs tentatives de réinitialisation du module de mesure. Vérifiez le branchement des capteurs et/ou redémarrez l'appareil de mesure puis réessayez.");
                    }

                    if (error instanceof TcpDaemonAnswerError) {
                        switch (error.code) {
                            case 1: { // Driver module initialization error
                                logger.warn("Init not finished.");
                                break;
                            }
                            case 2: { // Sensor module initialization/processing error
                                const warnings = await tcpConnection.getErrors();
                                await sqlConnections.insertLogs(this.currentCampaignId, LogLevelCode.WARNING, "Erreur du module de mesure", warnings[0].message, warnings[0].date);
                                await tcpConnection.resetModule();
                                await sqlConnections.insertLogs(this.currentCampaignId, LogLevelCode.PROCESSING, "Réinitilisation", "Le module de mesure est en cours de réinitilisation... Cette opération prend entre 20 et 40 secondes.");
                                if (await this.waitUntilReady()) {
                                    await sqlConnections.insertLogs(this.currentCampaignId, LogLevelCode.SUCCESS, "Réinitilisation", "Le module de mesure a bien été réinitialisé, la campagne reprend.");
                                }
                                
                                this.nbReset++;
                                break;
                            }
                            default: {
                                logger.warn("Erreur inconnue du module de mesure. Code d'erreur non répertorié.");
                            }
                        }
                    } else if (error instanceof Error) {
                        await sqlConnections.insertLogs(this.currentCampaignId, LogLevelCode.WARNING, "Erreur dans le processus de mesure", error.message);
                        this.nbReset++;
                    }
                    nextLoopMillis = new Date().getTime() + 2500;
                }

                if (this.numberOfMeasureLeft < 0) {
                    break;
                }
                
                await sleepUntilWhileRunning(nextLoopMillis);
            }

            await this.endCampaign(false, "La campagne s'est terminé avec succès.");
        } catch (error) {
            let message = "La campagne a été arrêté suite à une erreur. ";
            if (error instanceof Error) {
                message += error.message;
            } else {
                message += "Erreur inconnue.";
            }
            await this.endCampaign(true, message);
            logger.error("runCampaign: unhandled error while running campaign. " + error);
        }
    }

    /**
     * Waits until the daemon driver is ready to response the measurements.
     * @returns boolean - true if the daemon driver is ready, false if an error occured while waiting
     * @note You need to call this function with "await".
     */
    async waitUntilReady(): Promise<boolean> {
        // wait for the daemon driver to be ready
        while (true) {
            try {
                await tcpConnection.getMeasure();
                return true;
            } catch (error) {
                if (error instanceof TcpDaemonAnswerError) {
                    if (error.code == 1) {
                        // driver module initialization error (not ready)
                        await sleep(2500);
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }
        }
    }

    /**
     * Updates the parameters of the campaign to make it stop.
     * @param isError boolean - if true, it indicate a normal ending, else unexpected stop
     * @param message string - the stop message to insert in logs
     */
    private async endCampaign(isError: boolean, message: string) {
        if (!this.isRunning()){
            logger.warn("endCampaign function fired without any campaign running!");
            return;
        }
        
        this.isCampaignRunning = false;

        const logTitle: string = isError ? "Arrêt imprévu" : "Arrêt prévu";
        const logLevel: LogLevelCode = isError ? LogLevelCode.ERROR : LogLevelCode.SUCCESS;
        const campaignAlertLevel: CampaignStateLevelCode = isError ? CampaignStateLevelCode.ERROR : (this.nbReset == 0 ? CampaignStateLevelCode.SUCCESS : CampaignStateLevelCode.WARNING);

        await sqlConnections.setAlertLevel(this.currentCampaignId, campaignAlertLevel);
        await sqlConnections.setFinished(this.currentCampaignId, true);
        await sqlConnections.insertLogs(this.currentCampaignId, logLevel, logTitle, message);

        this.currentCampaignId = -1;

        await sleep(1000); // wait for the runningCampaign state to be updated (sleepUntilWhileRunning exited)
    }

    /**
     * Stops the running campaign with a specific id
     * @param campaignId number - id of the campaign to stop
     */
    async stopCampaign(campaignId:number){
        if(this.isRunning() && this.currentCampaignId == campaignId){
            await this.endCampaign(false, "La campagne a bien été stoppé suite à votre demande.");
        }
    }

    /**
     * Restarts an existing campaign in the database (running or not)
     * @param campaignId number - id of the campaign to restart
     */
    async restartCampaign(campaignId:number){
        await this.stopCampaign(campaignId);

        await sqlConnections.clearLogs(campaignId);
        await sqlConnections.clearMeasurements(campaignId);
        await sqlConnections.updateEndingDatePrediction(campaignId);

        await this.initCampaign(campaignId);
    }

    /**
     * Stops all running campaigns in the database
     */
    private async stopAllCampaigns() {
        const campaigns = await sqlConnections.getRunningCampaigns();
        campaigns.forEach(async (campaign) => {
            await sqlConnections.setAlertLevel(campaign.idCampaign, CampaignStateLevelCode.ERROR);
            await sqlConnections.setFinished(campaign.idCampaign, true);
            await sqlConnections.insertLogs(campaign.idCampaign, LogLevelCode.ERROR, "Arrêt imprévu", "La campagne a été arrêté suite à un redémarrage de l'appareil.");
        });
    }
}

/**
 * Global variable to access the campaign runner.
 */
export declare let campaignRunner: RunCampaign;

export function initCampaignRunner() {
    campaignRunner = new RunCampaign();
}