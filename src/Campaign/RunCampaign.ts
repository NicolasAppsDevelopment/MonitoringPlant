import { sqlConnections } from '../Database/DatabaseManager';
import {tcpConnection} from "../Tcp/TcpManager";

class RunCampaign {
    private currentCampaignId:number=-1;
    private numberOfMeasureLeft:number=0;


    RunCampaign(currentCampaignId:number,duration:number,interval:number,sensorState:JSON){
        this.currentCampaignId=currentCampaignId;
        this.numberOfMeasureLeft=duration/interval;

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
                    tcpConnection.sendCommandMeasure();
                }
            }
        }
        sqlConnections.insertLogs(this.currentCampaignId,"Arrêt prévu","La campagne s\'est terminé avec succès.")    
    }

    stopCampaign(){

    }

    restartCampaign(){

    }

    insertData(){
        tcpConnection.sendCommandMeasure();
        //const data = tcpConnection.readData();
        //const dataParsed = data.parse();
    }

    handleTcpData(data:string){
        let tcpResponse= JSON.parse(data,undefined);

    }

}