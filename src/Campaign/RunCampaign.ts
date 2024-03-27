import { sqlConnections } from '../Database/DatabaseManager';
import {tcpConnection} from "../Tcp/TcpManager";
import { logger } from "../Logger/LoggerManager";


export default class RunCampaign {
    private currentCampaignId:number=-1;
    private numberOfMeasureLeft:number=-1;
    private interval:number=-1;
    private nbReset=0;
    private warningBeforeReset:boolean=false;

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
        this.interval=interval*1000;
        this.nbReset=0;
        this.runCampaign();
    }

    getCurrentCampaign():number{
        return this.currentCampaignId;
    }

    async runCampaign(){
        while(this.numberOfMeasureLeft>0){
            let millis:Date= new Date();
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
                        if (measures.success){
                            const insertDataRequest = this.buildInsertSensorDataRequest(measures);

                            try{
                                sqlConnections.queryData(insertDataRequest);
                            }catch(error){
                                logger.error(error);
                            }
                            let now:Date=new Date();
                            await new Promise(f => setTimeout(f, this.interval-(now.getTime()-millis.getTime())));
                        }else if(measures.error == "Le dispositif de mesure a probablement été intérrompu à la suite d'une erreur. Pour plus d'information, consultez les erreurs avec GET_ERRORS puis tentez de le réinitialiser avec RESET."){
                            if(this.nbReset>1){
                                try{
                                    sqlConnections.insertLogs(this.currentCampaignId,2, "Arrêt imprévu","La campagne a été intérrompu après l'échec de plusieurs tentatives de réinitialisation du module de mesure. Vérifiez le branchement des capteurs et/ou redémarrez l'appareil de mesure puis réessayez.");
                                    sqlConnections.setAlertLevel(this.currentCampaignId,2);
                                    sqlConnections.setFinished(this.currentCampaignId);
                                    this.currentCampaignId=-1;
                                }catch(error){
                                    logger.error(error);
                                }
                            }
                            if(!this.warningBeforeReset){
                                try {
                                    sqlConnections.insertLogs(this.currentCampaignId,3,"Disfonctionnement du matériel","Une erreur à été detecté. Veuillez vérifiez que les capteurs sont bien branchés.");
                                } catch (error) {
                                    logger.error(error);
                                }
                                this.warningBeforeReset=true;
                                await new Promise(f => setTimeout(f, 30000));
                            }else{
                                this.nbReset++;
                                try {
                                    const warning= tcpConnection.getErrors(); //TODO GET ERROR pour retourner la bonne erreur
                                    sqlConnections.insertLogs(this.currentCampaignId,3,"Réinitilisation du module de mesure","Le module de mesure va être réinitialisé suite à une erreur survenu dans le module de mesure.");
                                    const reset= await tcpConnection.resetModule();
                                    await new Promise(f => setTimeout(f, 40000));
                                    if (reset){
                                        sqlConnections.insertLogs(this.currentCampaignId,3,"Réinitilisation du module de mesure","Le module de mesure a bien été réinitilisé avec succès. La campagne va reprendre sous peu.");
                                    }

                                } catch (error) {
                                    logger.error(error);
                                }
                            }


                        }else if(measures.error == "Le dispositif de mesure n'a fini de s'initialiser."){

                        }

                    } catch (error) {
                        logger.error(error);
                    }
                    
                }
            }
        }
        await sqlConnections.insertLogs(this.currentCampaignId, 1,"Arrêt prévu","La campagne s\'est terminé avec succès.")    
    }

    async stopCampaign(){
        if (this.currentCampaignId>0){
            await sqlConnections.setFinished(this.currentCampaignId);
            await sqlConnections.insertLogs(this.currentCampaignId,1,"Arrêt prévu","La campagne a bien été stoppé suite à votre demande.");
            this.currentCampaignId=-1;
            
        }

    }

    async restartCampaign(){

    }

    async insertData(){
        await tcpConnection.getMeasure();
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