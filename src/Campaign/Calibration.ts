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
    calibIsHumid :boolean = false;
    
    humidMode:boolean = false;
    enableFiboxTemp:boolean = false;

    /*constructor(idConfig:number, idCampaign:number){
        //this.initCalibration(idConfig,idCampaign);
    }*/

    
    async initCalibration(idConfig:number, idCampaign:number){
        this.idCampaign=idCampaign;
        this.idConfig=idConfig;

        let calibrateData = await sqlConnections.getCalibrationInfo(idConfig);
        let campaignData = await sqlConnections.getCampaignInfo(idCampaign);

        this.altitude=calibrateData.altitude;
        this.f1=calibrateData.f1;
        this.m=calibrateData.m;
        this.dphi1=calibrateData.dPhi1;
        this.dphi2=calibrateData.dPhi2;
        this.dksv1=calibrateData.dKSV1;
        this.dksv2=calibrateData.dKSV2;
        this.pressure=calibrateData.pressure;
        this.cal0=calibrateData.cal0;
        this.cal2nd=calibrateData.cal2nd;
        this.t0=calibrateData.t0;
        this.t2nd=calibrateData.t2nd;
        this.o2cal2nd=calibrateData.o2cal2nd;
        this.calibIsHumid=calibrateData.calibIsHumid;

        this.humidMode=campaignData.humidMode;
        this.enableFiboxTemp=campaignData.enableFiboxTemp;
    }

    /**
     * Build a command with all parameters to pass to the driver.
     * @returns command to pass to the driver that setup and get the sensor data
     */
    buildTCPCommandArgs(): string {
        let args: string = " "+this.altitude+" "+this.f1+" "+this.m+" "+this.dphi1+" "+this.dphi2+" "+this.dksv1+" "+this.dksv2;
        args += " " + this.pressure + " " + this.cal0 + " " + this.cal2nd+" "+this.t0+" "+this.t2nd+" "+this.o2cal2nd+" "+(+this.calibIsHumid);
        args += " " + this.humidMode + " " + this.enableFiboxTemp;
        return args;
    }

    getCalibNumber():number{
        return this.idConfig;
    }
    

}