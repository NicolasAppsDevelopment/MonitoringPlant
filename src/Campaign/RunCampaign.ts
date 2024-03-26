import { sqlConnections } from '../Database/DatabaseManager';
import {tcpConnection} from "../Tcp/TcpManager";
import { logger } from "../Logger/LoggerManager";


export default class RunCampaign {
    private currentCampaignId:number=-1;
    private numberOfMeasureLeft:number=-1;
    private o2SensorState:number=-1;
    private co2SensorState:number=-1;
    private humiditySensorState:number=-1;
    private luminositySensorState:number=-1;
    private temperature2SensorState:number=-1;


    initCampaign(currentCampaignId:number,duration:number,interval:number,sensorState:any){
        this.currentCampaignId=currentCampaignId;
        this.numberOfMeasureLeft=duration/interval*1000;
        this.o2SensorState=sensorState.o2;
        this.co2SensorState=sensorState.co2;
        this.humiditySensorState=sensorState.humidity;
        this.luminositySensorState=sensorState.luminosity;
        this.temperature2SensorState=sensorState.temperature;

        this.runCampaign();
    }

    getCurrentCampaign():number{
        return this.currentCampaignId;
    }

    async runCampaign(){
        
        while(this.numberOfMeasureLeft>0){
            if(this.currentCampaignId>0){
                this.numberOfMeasureLeft--;
                const result = await sqlConnections.queryData("SELECT idCampaign from Campaigns where finished=0;", []);
                if(result == undefined){
                    this.numberOfMeasureLeft=0;
                    break;
                }else{

                    try {
                        const measures = tcpConnection.getMeasure();
                    } catch (error) {
                        logger.error(error);
                    }
                    
                }
            }
        }
        sqlConnections.insertLogs(this.currentCampaignId, 1,"Arrêt prévu","La campagne s\'est terminé avec succès.")    
    }

    stopCampaign(){
        if (this.currentCampaignId>0){
            sqlConnections.setFinished(this.currentCampaignId);
            sqlConnections.insertLogs(this.currentCampaignId,1,"Arrêt prévu","La campagne a bien été stoppé suite à votre demande.");
            this.currentCampaignId=-1;
            
        }

    }

    restartCampaign(){

    }

    insertData(){
        tcpConnection.getMeasure();
        //const data = tcpConnection.readData();
        //const dataParsed = data.parse();
    }
}