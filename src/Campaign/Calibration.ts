import { logger } from '../Logger/LoggerManager';
import { sqlConnections } from '../Database/DatabaseManager';

export default class Calibration {
/**
 * Calibration data necessary for having good value for the sensors.
 */

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

    /*constructor(idConfig:number, idCampaign:number){
        //this.initCalibration(idConfig,idCampaign);
    }*/

    
    async initCalibration(idConfig:number, idCampaign:number){
        this.idCampaign=idCampaign;
        this.idConfig=idConfig;
        const queryCalibrate = "SELECT * from Configurations where idConfig= ? ;"
        const queryCampaign = "SELECT humidMode,enableFiboxTemp from Campaigns where idCampaign= ? ;"

        let calibrateData = await sqlConnections.queryData(queryCalibrate, [idConfig]);
        let campaignData = await sqlConnections.queryData(queryCampaign,[idCampaign]);

        if(calibrateData.length == 0){
            throw new Error("Impossible d'initialiser la calibration : la configuration de calibrtion n'existe pas.");
        }

        if(campaignData.length == 0){
            throw new Error("Impossible d'initialiser la calibration : la campagne n'existe pas.");
        }

        this.altitude=calibrateData[0].altitude;
        this.f1=calibrateData[0].f1;
        this.m=calibrateData[0].m;
        this.dphi1=calibrateData[0].dPhi1;
        this.dphi2=calibrateData[0].dPhi2;
        this.dksv1=calibrateData[0].dKSV1;
        this.dksv2=calibrateData[0].dKSV2;
        this.pressure=calibrateData[0].pressure;
        this.cal0=calibrateData[0].cal0;
        this.cal2nd=calibrateData[0].cal2nd;
        this.t0=calibrateData[0].t0;
        this.t2nd=calibrateData[0].t2nd;
        this.o2cal2nd=calibrateData[0].o2cal2nd;
        this.calib_is_humid=calibrateData[0].calibIsHumid;

        this.humidMode=campaignData[0].humidMode;
        this.enableFiboxTemp=campaignData[0].enableFiboxTemp;
    }

    /**
     * Build a command with all parameters to pass to the driver.
     * @returns command to pass to the driver that setup and get the sensor data
     */
    buildTCPCommandArgs(): string {
        let args: string = " "+this.altitude+" "+this.f1+" "+this.m+" "+this.dphi1+" "+this.dphi2+" "+this.dksv1+" "+this.dksv2;
        args += " " + this.pressure + " " + this.cal0 + " " + this.cal2nd+" "+this.t0+" "+this.t2nd+" "+this.o2cal2nd+" "+this.calib_is_humid;
        args += " " + this.humidMode + " " + this.enableFiboxTemp;
        return args;
    }

    getCalibNumber():number{
        return this.idConfig;
    }
    

}