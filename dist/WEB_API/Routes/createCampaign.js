"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DatabaseManager_1 = require("../../Database/DatabaseManager");
const TcpManager_1 = require("../../Tcp/TcpManager");
const Calibration_1 = __importDefault(require("../../Campaign/Calibration"));
const RunCampaign_1 = require("../../Campaign/RunCampaign");
/*
    URL : /test
    METHODE : POST
    CORPS : {"id": 69}
    CONTENT-TYPE : application/json

    DESCRIPTION : test de la connexion
*/
module.exports = function (app) {
    app.post('/createCampaign', async (req, res) => {
        let data = req.body;
        if (data.id == null || typeof data.id != "number") {
            res.status(400).send({ "error": "Des arguments sont manquants et/ou incorrectes dans le corps de la requête." });
            return;
        }
        // Traite la requête
        try {
            const currentCampaignId = data.id;
            DatabaseManager_1.sqlConnections.insertLogs(currentCampaignId, 0, "Campagne démarrée", "La campagne a été démarrée avec succès.");
            const result = await DatabaseManager_1.sqlConnections.queryData("SELECT * FROM Campaigns WHERE idCampaign=?;", [currentCampaignId]);
            const interval = result[0].interval;
            const duration = result[0].duration;
            const configNumber = result[0].idConfig;
            const sensorSelected = JSON.parse('{"O2":result[0].O2SensorState,"CO2":result[0].CO2SensorState,"humidity":result[0].humiditySensorState,"light":result[0].luminositySensorState,"temperature":result[0].temperatureSensorState}');
            let calibration = await new Calibration_1.default(configNumber, currentCampaignId);
            try {
                await TcpManager_1.tcpConnection.calibrateModule(calibration);
            }
            catch (error) {
            }
            //creation of a new thread
            RunCampaign_1.campaign.initCampaign(currentCampaignId, duration, interval, sensorSelected);
            const response = ["coucou"];
            res.send({ "success": response });
        }
        catch (error) {
            let message = 'Erreur inconnue';
            if (error instanceof Error)
                message = error.message;
            res.status(400).send({ "error": message });
            return;
        }
    });
};
