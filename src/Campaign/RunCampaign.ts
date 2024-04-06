import { sqlConnections } from '../Database/DatabaseManager';
import {tcpConnection} from "../Tcp/TcpManager";
import { logger } from "../Logger/LoggerManager";
import { sleep, sleepUntilWhileRunning } from "../Helper/sleep";
import { TcpDaemonAnswerError } from '../Tcp/TcpDaemonMessageTypes';
import Calibration from './Calibration';
import { SensorStates } from './SensorStatesType';
import { CampaignStateLevelCode, LogLevelCode } from '../Database/LevelCode';
import { log } from 'console';

 
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
     * @param duration - the total duration of the campaign in seconds
     */
    private duration: number;

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
        this.duration = -1;
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
     * Initialiaze a campaign runner with parameters retrieved from the database from a specific id.
     * @param currentCampaignId : number id of the campaign to start
     */
    async initCampaign(campaignId:number){
        if(this.isCampaignRunning){
            throw new Error("Une campagne est déjà en cours d'éxecution.");
        }

        const campaignData = await sqlConnections.getCampaignInfo(campaignId);

        if (campaignData.idConfig == null) {
            throw new Error("La campagne n'a pas de configuration de calibration associée.")
        }

        // set the configuration of the module
        let calibration = new Calibration();
        await calibration.initCalibration(campaignData.idConfig, campaignId);
        await tcpConnection.calibrateModule(calibration);

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
        this.duration = campaignData.duration;
        this.nbReset = 0;
        this.isCampaignRunning = true;
        
        this.runCampaign();
    }

    getCurrentCampaignId():number{
        return this.currentCampaignId;
    }

    isRunning(): boolean {
        return this.isCampaignRunning;
    }

    /**
     * Loop where the campaign will register the sensor data in the database and handle potential error.
     */
    async runCampaign() {
        try {
            await sqlConnections.insertLogs(this.currentCampaignId, LogLevelCode.SUCCESS, "Campagne démarrée", "La campagne a été démarrée avec succès.");

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
                        await this.endCampaign(true, "La campagne a été intérrompu après l'échec de plusieurs tentatives de réinitialisation du module de mesure. Vérifiez le branchement des capteurs et/ou redémarrez l'appareil de mesure puis réessayez.");
                        return;
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
                                this.nbReset++;
            
                                await sqlConnections.insertLogs(this.currentCampaignId, LogLevelCode.PROCESSING, "Réinitilisation du module de mesure", "Le module de mesure a bien été réinitilisé avec succès. La campagne va reprendre sous peu.");
                                break;
                            }
                            default: {
                                logger.warn("Erreur inconnue du module de mesure. Code d'erreur non répertorié.");
                            }
                        }
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
            logger.error("runCampaign: unhandled error while running campaign. " + error);
        }
    }

    /**
     * Update the parameters of the campaign to make it stop.
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
     * Stop the running campaign with a specific id
     * @param campaignId number - id of the campaign to stop
     */
    async stopCampaign(campaignId:number){
        if(this.isRunning() && this.currentCampaignId == campaignId){
            await this.endCampaign(false, "La campagne a bien été stoppé suite à votre demande.");
        }
    }

    /**
     * Restart an existing campaign in the database (running or not)
     * @param campaignId number - id of the campaign to restart in the database
     */
    async restartCampaign(campaignId:number){
        await this.stopCampaign(campaignId);
        await this.initCampaign(campaignId);
    }

    /**
     * Stop all running campaigns in the database
     */
    private async stopAllCampaigns() {
        const campaigns = await sqlConnections.getRunningCampaigns();
        campaigns.forEach(async (campaign) => {
            await this.stopCampaign(campaign.idCampaign);
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