"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DatabaseManager_1 = require("../Database/DatabaseManager");
class Calibration {
    idConfig = -1;
    idCampaign = -1;
    altitude = 0;
    f1 = 0;
    m = 0;
    dphi1 = 0;
    dphi2 = 0;
    dksv1 = 0;
    dksv2 = 0;
    pressure = 0;
    cal0 = 0;
    cal2nd = 0;
    t0 = 0;
    t2nd = 0;
    o2cal2nd = 0;
    calib_is_humid = 0;
    humidMode = 0;
    enableFiboxTemp = 0;
    constructor(idConfig, idCampaign) {
        this.initCalibration(idConfig, idCampaign);
    }
    async initCalibration(idConfig, idCampaign) {
        this.idCampaign = idCampaign;
        this.idConfig = idConfig;
        const queryCalibrate = "SELECT * from Configurations where idConfig= ? ;";
        const calibrateData = await DatabaseManager_1.sqlConnections.queryData(queryCalibrate, [idConfig]);
        const queryCampaign = "SELECT humidMode,enableFiboxTemp from Campaigns where idCampaign= ? ;";
        const campaignData = await DatabaseManager_1.sqlConnections.queryData(queryCampaign, [idCampaign]);
        this.altitude = calibrateData[0].altitude;
        this.f1 = calibrateData[0].f1;
        this.m = calibrateData[0].m;
        this.dphi1 = calibrateData[0].dphi1;
        this.dphi2 = calibrateData[0].dphi2;
        this.dksv1 = calibrateData[0].dksv1;
        this.dksv2 = calibrateData[0].dksv2;
        this.pressure = calibrateData[0].pressure;
        this.cal0 = calibrateData[0].cal0;
        this.cal2nd = calibrateData[0].cal2nd;
        this.t0 = calibrateData[0].t0;
        this.t2nd = calibrateData[0].t2nd;
        this.o2cal2nd = calibrateData[0].o2cal2nd;
        this.calib_is_humid = calibrateData[0].calib_is_humid;
        this.humidMode = campaignData[0].humidMode;
        this.enableFiboxTemp = campaignData[0].enableFiboxTemp;
    }
    buildTCPCommand() {
        let command = " " + this.altitude + " " + this.f1 + " " + this.m + " " + this.dphi1 + " " + this.dphi2 + " " + this.dksv1 + " " + this.dksv2;
        command += " " + this.pressure + " " + this.cal0 + " " + this.cal2nd + " " + this.t0 + " " + this.t2nd + " " + this.o2cal2nd + " " + this.calib_is_humid;
        command += " " + this.humidMode + " " + this.enableFiboxTemp;
        return command;
    }
    getCalibNumber() {
        return this.idConfig;
    }
}
exports.default = Calibration;
