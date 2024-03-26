import { sqlConnections } from '../Database/DatabaseManager';

export default class Calibration {
    idConfig:number=-1;
    idCampaign:number=-1;

    altitude:number=0;
    f1:number=0;
    m:number=0;
    dphi1:number=0;
    dphi2 :number=0;
    dksv1 :number=0;
    dksv2 :number=0;
    pressure:number=0;
    cal0 :number=0;
    cal2nd :number=0;
    t0:number=0;
    t2nd:number=0;
    o2cal2nd :number=0;
    calib_is_humid :number=0;
    
    humidMode:number = 0;
    enableFiboxTemp:number=0;

    constructor(idConfig:number, idCampaign:number){
        this.initCalibration(idConfig,idCampaign);
    }

    async initCalibration(idConfig:number, idCampaign:number){
        this.idCampaign=idCampaign;
        this.idConfig=idConfig;
        const queryCalibrate = "SELECT * from Configurations where idConfig= ? ;"
        const calibrateData = await sqlConnections.queryData(queryCalibrate, [idConfig]);

        const queryCampaign = "SELECT humidMode,enableFiboxTemp from Campaigns where idCampaign= ? ;"
        const campaignData = await sqlConnections.queryData(queryCampaign,[idCampaign])

        this.altitude=calibrateData[0].altitude;
        this.f1=calibrateData[0].f1;
        this.m=calibrateData[0].m;
        this.dphi1=calibrateData[0].dphi1;
        this.dphi2=calibrateData[0].dphi2;
        this.dksv1=calibrateData[0].dksv1;
        this.dksv2=calibrateData[0].dksv2;
        this.pressure=calibrateData[0].pressure;
        this.cal0=calibrateData[0].cal0;
        this.cal2nd=calibrateData[0].cal2nd;
        this.t0=calibrateData[0].t0;
        this.t2nd=calibrateData[0].t2nd;
        this.o2cal2nd=calibrateData[0].o2cal2nd;
        this.calib_is_humid=calibrateData[0].calib_is_humid;

        this.humidMode=campaignData[0].humidMode;
        this.enableFiboxTemp=campaignData[0].enableFiboxTemp;
    }

    buildTCPCommand():string{
        let command:string= " "+this.altitude+" "+this.f1+" "+this.m+" "+this.dphi1+" "+this.dphi2+" "+this.dksv1+" "+this.dksv2;
        command += " "+this.pressure+" "+this.cal0+" "+this.cal2nd+" "+this.t0+" "+this.t2nd+" "+this.o2cal2nd+" "+this.calib_is_humid;
        command+= " "+this.humidMode+" "+this.enableFiboxTemp;

        return command;
    }

    getCalibNumber():number{
        return this.idConfig;
    }
    

}