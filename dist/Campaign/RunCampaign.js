"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DatabaseManager_1 = require("../Database/DatabaseManager");
const TcpManager_1 = require("../Tcp/TcpManager");
const LoggerManager_1 = require("../Logger/LoggerManager");
class RunCampaign {
    currentCampaignId = -1;
    numberOfMeasureLeft = -1;
    o2SensorState = -1;
    co2SensorState = -1;
    humiditySensorState = -1;
    luminositySensorState = -1;
    temperature2SensorState = -1;
    initCampaign(currentCampaignId, duration, interval, sensorState) {
        this.currentCampaignId = currentCampaignId;
        this.numberOfMeasureLeft = duration / interval * 1000;
        this.o2SensorState = sensorState.o2;
        this.co2SensorState = sensorState.co2;
        this.humiditySensorState = sensorState.humidity;
        this.luminositySensorState = sensorState.luminosity;
        this.temperature2SensorState = sensorState.temperature;
        this.runCampaign();
    }
    getCurrentCampaign() {
        return this.currentCampaignId;
    }
    async runCampaign() {
        while (this.numberOfMeasureLeft > 0) {
            if (this.currentCampaignId > 0) {
                this.numberOfMeasureLeft--;
                const result = await DatabaseManager_1.sqlConnections.queryData("SELECT idCampaign from Campaigns where finished=0;", []);
                if (result == undefined) {
                    this.numberOfMeasureLeft = 0;
                    break;
                }
                else {
                    try {
                        const measures = TcpManager_1.tcpConnection.getMeasure();
                    }
                    catch (error) {
                        LoggerManager_1.logger.error(error);
                    }
                }
            }
        }
        DatabaseManager_1.sqlConnections.insertLogs(this.currentCampaignId, 1, "Arrêt prévu", "La campagne s\'est terminé avec succès.");
    }
    stopCampaign() {
        if (this.currentCampaignId > 0) {
            DatabaseManager_1.sqlConnections.setFinished(this.currentCampaignId);
            DatabaseManager_1.sqlConnections.insertLogs(this.currentCampaignId, 1, "Arrêt prévu", "La campagne a bien été stoppé suite à votre demande.");
            this.currentCampaignId = -1;
        }
    }
    restartCampaign() {
    }
    insertData() {
        TcpManager_1.tcpConnection.getMeasure();
        //const data = tcpConnection.readData();
        //const dataParsed = data.parse();
    }
    buildInsertSensorDataRequest(sensorData) {
        let date = new Date();
        let values = "";
        if (this.temperature2SensorState > 0) {
            values += sensorData.data.temperature + ",";
        }
        else {
            values += "NULL,";
        }
        if (this.co2SensorState > 0) {
            values += sensorData.data.co2 + ",";
        }
        else {
            values += "NULL,";
        }
        if (this.o2SensorState > 0) {
            values += sensorData.data.o2 + ",";
        }
        else {
            values += "NULL,";
        }
        if (this.humiditySensorState > 0) {
            values += sensorData.data.humidity;
        }
        else {
            values += "NULL,";
        }
        if (this.luminositySensorState > 0) {
            values += sensorData.data.luminosity;
        }
        else {
            values += "NULL";
        }
        let query = "INSERT INTO Measurements values(" + this.currentCampaignId + "," + values + "," + date + ");";
        return "";
    }
}
exports.default = RunCampaign;
