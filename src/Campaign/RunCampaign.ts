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

                let idCampaign: any | null = null;
                try {
                    idCampaign = await sqlConnections.queryData("SELECT idCampaign from Campaigns where finished=0;");
                } catch (error) {
                    logger.error("Error runCampaign: " + error);
                }
                if(idCampaign == null){
                    this.numberOfMeasureLeft=0;
                    break;
                }else{
                    try {
                        const measures = await tcpConnection.getMeasure();
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

    buildInsertSensorDataRequest(sensorData:any):string{
        let date:Date=new Date();

        let values:string="";
        if(this.temperature2SensorState>0){
            values+=sensorData.data.temperature+",";
        }else{
            values+="NULL,";
        }
        if(this.co2SensorState>0){
            values+=sensorData.data.co2+",";
        }else{
            values+="NULL,"
        }
        if(this.o2SensorState>0){
            values+=sensorData.data.o2+",";
        }else{
            values+="NULL,"
        }

        if(this.humiditySensorState>0){
            values+=sensorData.data.humidity;
        }else{
            values+="NULL,"
        }
            
        if(this.luminositySensorState>0){
            values+=sensorData.data.luminosity;
        }else{
            values+="NULL"
        }
        let query="INSERT INTO Measurements values("+this.currentCampaignId+","+values+","+date+");"
        return "";
    }

}

export declare let campaign: RunCampaign;