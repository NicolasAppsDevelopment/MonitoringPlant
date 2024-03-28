import { sqlConnections } from '../Database/DatabaseManager';
import {tcpConnection} from "../Tcp/TcpManager";
import { logger } from "../Logger/LoggerManager";
import { sleep, sleepUntil } from "../Helper/sleep";
import { TcpDaemonMeasurement } from '../Tcp/TcpCommandAnswerTypes';
import { TcpDaemonAnswerError } from '../Tcp/TcpDaemonMessageTypes';


 
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
        this.nbReset = 0;
        this.isCampaignRunning = false;
    
        this.o2SensorState = false;
        this.co2SensorState = false;
        this.humiditySensorState = false;
        this.luminositySensorState = false;
        this.temperature2SensorState = false;
    }
/**
 * Initialiaze the parameters of the class
 * @param currentCampaignId : number 
 * @param duration : number
 * @param interval : number
 * @param sensorState : a JSON that contains the used data about the 5 sensors. The json contains booleans.
 */
    initCampaign(currentCampaignId:number,duration:number,interval:number,sensorState:any){
        this.currentCampaignId = currentCampaignId;
        this.numberOfMeasureLeft = duration / interval * 1000;
        this.o2SensorState = sensorState.o2;
        this.co2SensorState = sensorState.co2;
        this.humiditySensorState = sensorState.humidity;
        this.luminositySensorState = sensorState.luminosity;
        this.temperature2SensorState = sensorState.temperature;
        this.interval = interval * 1000;
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
        await sqlConnections.insertLogs(this.currentCampaignId, 0,"Campagne démarrée","La campagne a été démarrée avec succès.");

        let nextLoopMillis: number = new Date().getTime();
        while(this.numberOfMeasureLeft > 0 && this.isCampaignRunning){
            nextLoopMillis += this.interval;
            this.numberOfMeasureLeft--;

            try {
                const measures = await tcpConnection.getMeasure();
                const insertDataRequest = this.buildInsertSensorDataRequest(measures);
                await sqlConnections.queryData(insertDataRequest);
                this.nbReset=0;
            } catch (error) {
                logger.error("runCampaign: error while getting measure. " + error);

                if (error instanceof TcpDaemonAnswerError) {
                    switch (error.code) {
                        case 1: // Driver module initialization error
                            logger.warn("Init not finished.");
                            break;

                        case 2: // Sensor module initialization/processing error
                            const warnings = await tcpConnection.getErrors();
                            await sqlConnections.insertLogs(this.currentCampaignId,3,"Erreur du module de mesure", warnings[0].message, warnings[1].date);
                            
                            if(this.nbReset >= 2){
                                await this.endCampaign(true, "La campagne a été intérrompu après l'échec de plusieurs tentatives de réinitialisation du module de mesure. Vérifiez le branchement des capteurs et/ou redémarrez l'appareil de mesure puis réessayez.");
                                return;
                            }
        
                            await tcpConnection.resetModule();
                            this.nbReset++;
        
                            await sqlConnections.insertLogs(this.currentCampaignId,3,"Réinitilisation du module de mesure","Le module de mesure a bien été réinitilisé avec succès. La campagne va reprendre sous peu.");
                            break;

                        default:
                            logger.warn("Erreur inconnue du module de mesure. Code non répertorié.");
                    }
                }
                nextLoopMillis = new Date().getTime() + 2500;
            }
            await sleepUntil(nextLoopMillis);
        }
        await this.endCampaign(false, "La campagne s\'est terminé avec succès.");
    }

    /**
     * update the parameters of the campaign to make it stop depending of the parameters given.
     * @param isError boolean - if true planned ending else emergency stop
     * @param message string - the message to insert in logs
     * @returns Promise<void>
     */
    private async endCampaign(isError: boolean, message: string){
        if (!this.isRunning()){
            logger.warn("endCampaign function fired without any campaign running!");
            return;
        }

        const logTitle: string = isError ? "Arrêt imprévu" : "Arrêt prévu";
        const logLevel: number = isError ? 2 : 1;

        await sqlConnections.setAlertLevel(this.currentCampaignId, logLevel);
        await sqlConnections.setFinished(this.currentCampaignId);
        await sqlConnections.insertLogs(this.currentCampaignId, logLevel, logTitle, message);
        this.currentCampaignId = -1;
        this.isCampaignRunning = false;
    }

    async stopCampaign(){
        this.endCampaign(false, "La campagne a bien été stoppé suite à votre demande.");
    }

    /**
     * Start an existing campagn by updating it's parameter and launching runCampaign()
     * @param campaignId number -  id of the campaign to restart in the database
     * @returns Promise <boolean>
     */
    async restartCampaign(campaignId:number){
        try{
            const campaignData = await sqlConnections.queryData("SELECT * FROM Campaigns WHERE idCampaign = ? ;", [campaignId]);
            if(!this.isCampaignRunning){
                
                let o2:boolean;
                let co2:boolean;
                let luminosity:boolean;
                let humidity:boolean;
                let temperature:boolean;
    
                if(campaignData[0].O2SensorState == 1){
                    o2 = true;
                }else{
                     o2 = false;
                }
                if(campaignData[0].CO2SensorState == 1){
                    co2 = true;
                }else{
                     co2 = false;
                }
                if(campaignData[0].humiditySensorState == 1){
                    luminosity = true;
                }else{
                    luminosity = false;
                }
                if(campaignData[0].luminositySensorState == 1){
                    humidity = true;
                }else{
                    humidity = false;
                }
                if(campaignData[0].temperatureSensorState == 1){
                    temperature = true;
                }else{
                    temperature = false;
                }
    
                const sensorSelected={
                    "O2":o2,
                    "CO2":co2,
                    "humidity":humidity,
                    "light":luminosity,
                    "temperature":temperature};


                    await sqlConnections.queryData("update Campaigns set finished = 0 where idCampaign= ? ", [campaignId]);
                    await sqlConnections.queryData("update Campaigns set alertLevel = 0 where idCampaign= ? ", [campaignId]);

                this.initCampaign(campaignId, campaignData[0].duration, campaignData[0].duration, sensorSelected);

                return true;
            }
        }catch(error){
            return false;
        }

    }

    /**
     * Update the parameter of a campaign already running. 
     * @param idCampaign number - id of the campaign which was deleted from the database
     */
    removeCampaign(idCampaign:number){
        if(this.isRunning() && this.currentCampaignId == idCampaign ){
            this.currentCampaignId = -1;
            this.isCampaignRunning = false;
        }
    }

    async insertData(){
        const data = await tcpConnection.getMeasure();
        let request = this.buildInsertSensorDataRequest(data);
        try {
            await sqlConnections.queryData(request);
        } catch (error) {
            
        }
    }


    buildInsertSensorDataRequest(sensorData: TcpDaemonMeasurement): string {
        let date:Date=new Date();

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
            values+=sensorData.humidity;
        }else{
            values+="NULL,"
        }
            
        if(this.luminositySensorState){
            values+=sensorData.luminosity;
        }else{
            values+="NULL"
        }
        let query="INSERT INTO Measurements values("+this.currentCampaignId+","+values+","+date+");"
        return query;
    }
}

export declare let campaignRunner: RunCampaign;

export function initCampaignRunner() {
    campaignRunner = new RunCampaign();
}