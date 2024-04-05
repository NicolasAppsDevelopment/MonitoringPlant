import { sqlConnections } from '../Database/DatabaseManager';
import {tcpConnection} from "../Tcp/TcpManager";
import { logger } from "../Logger/LoggerManager";
import { sleep, sleepUntilWhileRunning } from "../Helper/sleep";
import { TcpDaemonMeasurement } from '../Tcp/TcpCommandAnswerTypes';
import { TcpDaemonAnswerError } from '../Tcp/TcpDaemonMessageTypes';
import Calibration from './Calibration';

 
export default class RunCampaign {
    /**
  * @param currentCampaignId - id of the running campaign
  * @param numberOfMeasureLeft - the number of measure to register in the campaign
  * @param interval - the interval between two measurements in milliseconds
  * @param duration - the total duration of the campaign in seconds
  * @param isCampaignRunning - boolean that signal if a campaign is currently running
  * 
  * @param o2SensorState - is the o2 sensor used in this campaign
  * @param co2SensorState - is the co2 sensor used in this campaign
  * @param humiditySensorState - is the humidity sensor used in this campaign
  * @param luminositySensorState - is the luminosity sensor used in this campaign
  * @param temperature2SensorState - is the temperature sensor used in this campaign
  * 
  */

    private currentCampaignId: number;
    private numberOfMeasureLeft: number;
    private interval: number;
    private duration: number;
    private nbReset: number;
    private isCampaignRunning: boolean;

    private o2SensorState: boolean;
    private co2SensorState: boolean;
    private humiditySensorState: boolean;
    private luminositySensorState: boolean;
    private temperature2SensorState: boolean;

    constructor() {
        this.currentCampaignId = -1;
        this.numberOfMeasureLeft = -1;
        this.interval = -1;
        this.duration = -1;
        this.nbReset = 0;
        this.isCampaignRunning = false;
    
        this.o2SensorState = false;
        this.co2SensorState = false;
        this.humiditySensorState = false;
        this.luminositySensorState = false;
        this.temperature2SensorState = false;

        this.stopAllCampaigns();
    }

    /**
     * Initialiaze the parameters of the class
     * @param currentCampaignId : number 
     */
    async initCampaign(campaignId:number){
        if(this.isCampaignRunning){
            throw new Error("Une campagne est déjà en cours d'éxecution.");
        }

        const campaignsData = await sqlConnections.queryData("SELECT * FROM Campaigns WHERE idCampaign = ? ;", [campaignId]);
        if(campaignsData.length == 0){
            throw new Error("La campagne n'existe pas.");
        }

        const campaignData = campaignsData[0];

        // set the configuration of the module
        let calibration = new Calibration();
        await calibration.initCalibration(campaignData.idConfig, campaignId);
        await tcpConnection.calibrateModule(calibration);

        await sqlConnections.setAlertLevel(campaignId, 0);
        await sqlConnections.setFinished(campaignId, false);
                
        this.o2SensorState = campaignData.O2SensorState;
        this.co2SensorState = campaignData.CO2SensorState;
        this.luminositySensorState = campaignData.luminositySensorState;
        this.humiditySensorState = campaignData.humiditySensorState;
        this.temperature2SensorState = campaignData.temperatureSensorState;

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
     * Run a loop where the campaign will register the sensor data in the database and handle potential error.
     */
    async runCampaign(){
        try {
            await sqlConnections.insertLogs(this.currentCampaignId, 0, "Campagne démarrée", "La campagne a été démarrée avec succès.");

            let nextLoopMillis: number = new Date().getTime();
            while (this.numberOfMeasureLeft >= 0 && this.isCampaignRunning) {
                nextLoopMillis += this.interval;
                this.numberOfMeasureLeft--;

                try {
                    const measures = await tcpConnection.getMeasure();
                    const insertDataRequest = this.buildInsertSensorDataRequest(measures);
                    await sqlConnections.queryData(insertDataRequest);
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
                                await sqlConnections.insertLogs(this.currentCampaignId, 3, "Erreur du module de mesure", warnings[0].message, warnings[0].date);
                                await tcpConnection.resetModule();
                                this.nbReset++;
            
                                await sqlConnections.insertLogs(this.currentCampaignId, 0, "Réinitilisation du module de mesure", "Le module de mesure a bien été réinitilisé avec succès. La campagne va reprendre sous peu.");
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
     * update the parameters of the campaign to make it stop. The method of stopping change
     * with the parameters given.
     * @param isError boolean - if true : planned ending else emergency stop
     * @param message string - the message to insert in logs
     * @returns Promise<void>
     */
    private async endCampaign(isError: boolean, message: string){
        if (!this.isRunning()){
            logger.warn("endCampaign function fired without any campaign running!");
            return;
        }
        
        this.isCampaignRunning = false;

        const logTitle: string = isError ? "Arrêt imprévu" : "Arrêt prévu";
        const logLevel: number = isError ? 2 : 1;
        const campaignAlertLevel: number = isError ? 2 : (this.nbReset == 0 ? 0 : 1);

        await sqlConnections.setAlertLevel(this.currentCampaignId, campaignAlertLevel);
        await sqlConnections.setFinished(this.currentCampaignId, true);
        await sqlConnections.insertLogs(this.currentCampaignId, logLevel, logTitle, message);
        await sqlConnections.queryData("UPDATE Campaigns SET endingDate=NOW() WHERE idCampaign = ?", [this.currentCampaignId]);

        this.currentCampaignId = -1;

        await sleep(1000); // wait for the runningCampaign state to be updated (sleepUntilWhileRunning exited)
    }

    async stopCampaign(campaignId:number){
        if(this.isRunning() && this.currentCampaignId == campaignId){
            await this.endCampaign(false, "La campagne a bien été stoppé suite à votre demande.");
        }
    }

    /**
     * Start an existing campagn by updating the parameters and launching runCampaign()
     * @param campaignId number -  id of the campaign to restart in the database
     * @returns Promise <boolean>
     */
    async restartCampaign(campaignId:number){
        await this.stopCampaign(campaignId);
        await this.initCampaign(campaignId);
        await sqlConnections.queryData("UPDATE Campaigns SET beginDate=NOW() WHERE idCampaign = ?", [this.currentCampaignId]);
        await sqlConnections.queryData("UPDATE Campaigns SET endingDate=DATE_ADD(NOW(), INTERVAL ? SECOND) WHERE idCampaign = ?", [this.duration, campaignId]);
    }

    async insertData(){
        const data = await tcpConnection.getMeasure();
        let request = this.buildInsertSensorDataRequest(data);
        try {
            await sqlConnections.queryData(request);
        } catch (error) {
            
        }
    }

    /**
     * Build a SQL request depending of the sensor needed for the campaign.
     * @param sensorData TcpDaemonMeasurement - sensor data from the daemon driver
     * @returns the command to insert into the database
     */
    buildInsertSensorDataRequest(sensorData: TcpDaemonMeasurement): string {
        let values:string="";
        if(this.temperature2SensorState){
            values+=sensorData.temperature+",";
        }else{
            values+="NULL,";
        }
        if(this.co2SensorState){
            values+=sensorData.CO2+",";
        }else{
            values+="NULL,"
        }
        if(this.o2SensorState){
            values+=sensorData.O2+",";
        }else{
            values+="NULL,"
        }

        if(this.humiditySensorState){
            values+=sensorData.humidity+",";
        }else{
            values+="NULL,"
        }
            
        if(this.luminositySensorState){
            values+=sensorData.luminosity;
        }else{
            values+="NULL"
        }
        let query="INSERT INTO Measurements values("+this.currentCampaignId+","+values+",NOW());"
        return query;
    }

    /**
     * Stop all running campaigns in the database
     */
    private async stopAllCampaigns() {
        // stop all running campaign in DB
        const campaigns = await sqlConnections.queryData("SELECT idCampaign FROM Campaigns WHERE finished = 0;");
        campaigns.forEach(async (campaign: { idCampaign: number; }) => {
            await sqlConnections.setAlertLevel(campaign.idCampaign, 2);
            await sqlConnections.setFinished(campaign.idCampaign, true);
            await sqlConnections.insertLogs(campaign.idCampaign, 2, "Arrêt imprévu", "La campagne a été arrêté suite à un redémarrage de l'appareil.");
            await sqlConnections.queryData("UPDATE Campaigns SET endingDate=NOW() WHERE idCampaign = ?;", [campaign.idCampaign]);
        });
    }
}

export declare let campaignRunner: RunCampaign;

export function initCampaignRunner() {
    campaignRunner = new RunCampaign();
}