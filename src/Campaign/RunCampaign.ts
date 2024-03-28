import { sqlConnections } from '../Database/DatabaseManager';
import {tcpConnection} from "../Tcp/TcpManager";
import { logger } from "../Logger/LoggerManager";
import { sleep, sleepUntil } from "../Helper/sleep";
import { TcpDaemonMeasurement } from '../Tcp/TcpCommandAnswerTypes';
import { TcpDaemonAnswerError } from '../Tcp/TcpDaemonMessageTypes';


export default class RunCampaign {
    private currentCampaignId: number;
    private numberOfMeasureLeft: number;
    private interval: number;
    private nbReset: number;
    private isCampaignRunning: boolean;

    private o2SensorState: number;
    private co2SensorState: number;
    private humiditySensorState: number;
    private luminositySensorState: number;
    private temperature2SensorState: number;

    constructor() {
        this.currentCampaignId = -1;
        this.numberOfMeasureLeft = -1;
        this.interval = -1;
        this.nbReset = 0;
        this.isCampaignRunning = false;
    
        this.o2SensorState = -1;
        this.co2SensorState = -1;
        this.humiditySensorState = -1;
        this.luminositySensorState = -1;
        this.temperature2SensorState = -1;
    }

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

    getCurrentCampaign():number{
        return this.currentCampaignId;
    }

    isRunning(): boolean {
        return this.isCampaignRunning;
    }

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

    async restartCampaign(campaignId:number){
        try{
            const campaignData = await sqlConnections.queryData("SELECT * FROM Campaigns WHERE idCampaign = ? ;", [campaignId]);
            if(!this.isCampaignRunning){
                const sensorSelected={
                    "O2":campaignData[0].O2SensorState,
                    "CO2":campaignData[0].CO2SensorState,
                    "humidity":campaignData[0].humiditySensorState,
                    "light":campaignData[0].luminositySensorState,
                    "temperature":campaignData[0].temperatureSensorState};

                    await sqlConnections.queryData("update Campaigns set finished = 0 where idCampaign= ? ", [campaignId]);
                    await sqlConnections.queryData("update Campaigns set alertLevel = 0 where idCampaign= ? ", [campaignId]);

                this.initCampaign(campaignId, campaignData[0].duration, campaignData[0].duration, sensorSelected);

                return true;
            }
        }catch(error){
            return false;
        }

    }

    removeCampaign(idCampaign:number){
        if(this.isRunning() && this.currentCampaignId == idCampaign ){
            this.currentCampaignId = -1;
            this.isCampaignRunning = false;
        }
    }

    async insertData(){
        const m = await tcpConnection.getMeasure();
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