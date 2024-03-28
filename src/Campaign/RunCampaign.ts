import { sqlConnections } from '../Database/DatabaseManager';
import {tcpConnection} from "../Tcp/TcpManager";
import { logger } from "../Logger/LoggerManager";
import { sleep } from "../Helper/sleep";


export default class RunCampaign {
    private currentCampaignId: number;
    private numberOfMeasureLeft: number;
    private interval: number;
    private nbReset: number;
    private isCampaignRunning: boolean;
    private warningBeforeReset: boolean;

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
        this.warningBeforeReset = false;
    
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
                        console.log(measures);
                        if (measures.success){
                            const insertDataRequest = this.buildInsertSensorDataRequest(measures);
                            await sqlConnections.queryData(insertDataRequest);
                            let now:Date=new Date();
                            await sleep(this.interval-(now.getTime()-millis.getTime()));
                        }else if(measures.error == "Le dispositif de mesure a probablement été intérrompu à la suite d'une erreur. Pour plus d'information, consultez les erreurs avec GET_ERRORS puis tentez de le réinitialiser avec RESET."){
                            if(this.nbReset>1){
                                await this.endCampaign(true, "La campagne a été intérrompu après l'échec de plusieurs tentatives de réinitialisation du module de mesure. Vérifiez le branchement des capteurs et/ou redémarrez l'appareil de mesure puis réessayez.");
                                return;
                            }
                            if(!this.warningBeforeReset){
                                await sqlConnections.insertLogs(this.currentCampaignId,3,"Disfonctionnement du matériel","Une erreur à été detecté. Veuillez vérifiez que les capteurs sont bien branchés.");
                                this.warningBeforeReset=true;
                                await sleep(30000);
                            }else{
                                this.nbReset++;
                                const warning= await tcpConnection.getErrors(); //TODO GET ERROR pour retourner la bonne erreur
                                await sqlConnections.insertLogs(this.currentCampaignId,3,"Réinitilisation du module de mesure","Le module de mesure va être réinitialisé suite à une erreur survenu dans le module de mesure.");
                                const reset= await tcpConnection.resetModule();
                                await sleep(40000);
                                if (reset){
                                    sqlConnections.insertLogs(this.currentCampaignId,3,"Réinitilisation du module de mesure","Le module de mesure a bien été réinitilisé avec succès. La campagne va reprendre sous peu.");
                                }
                            }
                        }else if(measures.error == "Le dispositif de mesure n'a fini de s'initialiser."){
                            logger.warn(measures.error);
                        }
                    } catch (error) {
                        logger.error(error);
                        const warnings: any[] = await tcpConnection.getErrors(); //TODO GET ERROR pour retourner la bonne erreur
                        warnings.forEach(warn => {
                            logger.warn(warn.date + " -> " + warn.message);
                        });
                    }
                }
            }
            await sleep(1000);
        }
        await this.endCampaign(false, "La campagne s\'est terminé avec succès.");
    }

    private async endCampaign(isError: boolean, message: string){
        if (!this.isCampaignRunning){
            logger.warn("endCampaign function fired without any campaign running!");
            return;
        }

        const logTitle: string = isError ? "Arrêt imprévu" : "Arrêt prévu";
        const logLevel: number = isError ? 2 : 1;

        await sqlConnections.setAlertLevel(this.currentCampaignId, logLevel);
        await sqlConnections.setFinished(this.currentCampaignId);
        await sqlConnections.insertLogs(this.currentCampaignId, logLevel, logTitle, message);
        this.currentCampaignId=-1;
        this.isCampaignRunning = false;
    }

    async stopCampaign(){
        this.endCampaign(false, "La campagne a bien été stoppé suite à votre demande.");
    }

    async restartCampaign(){

    }

    async insertData(){
        const m = await tcpConnection.getMeasure();
    }

    buildInsertSensorDataRequest(sensorData:any):string{
        let date:Date=new Date();

        let values:string="";
        if(this.temperature2SensorState){
            values+=sensorData.data.temperature+",";
        }else{
            values+="NULL,";
        }
        if(this.co2SensorState){
            values+=sensorData.data.co2+",";
        }else{
            values+="NULL,"
        }
        if(this.o2SensorState){
            values+=sensorData.data.o2+",";
        }else{
            values+="NULL,"
        }

        if(this.humiditySensorState){
            values+=sensorData.data.humidity;
        }else{
            values+="NULL,"
        }
            
        if(this.luminositySensorState){
            values+=sensorData.data.luminosity;
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