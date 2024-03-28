import { Express, Request, Response } from 'express';
import { sqlConnections } from '../../Database/DatabaseManager';
import { tcpConnection } from "../../Tcp/TcpManager";
import Calibration from '../../Campaign/Calibration';
import RunCampaign, { campaignRunner } from '../../Campaign/RunCampaign';
import { logger } from "../../Logger/LoggerManager";


/*
    URL : /test
    METHODE : POST
    CORPS : {"id": 69}
    CONTENT-TYPE : application/json

    DESCRIPTION : test de la connexion
*/
module.exports = function(app: Express){
    app.post('/createCampaign', async (req: Request, res: Response) => {
        let data = req.body;
        
        if (data.id == null || typeof data.id != "number") {
            res.status(400).send({"error": "Des arguments sont manquants et/ou incorrectes dans le corps de la requête."});
            return;
        }

        // Traite la requête
        try {
            if (campaignRunner.isRunning()) {
                throw new Error("Une campagne est déjà en cours d'éxecution.");
            }

            const currentCampaignId = data.id;
            const result = await sqlConnections.queryData("SELECT * FROM Campaigns WHERE idCampaign=?;", [currentCampaignId]);
            
            const interval=result[0].interval_; // DO NOT FORGET "_" !!
            const duration=result[0].duration;
            const configNumber=result[0].idConfig;
            const sensorSelected={
                "O2":result[0].O2SensorState,
                "CO2":result[0].CO2SensorState,
                "humidity":result[0].humiditySensorState,
                "light":result[0].luminositySensorState,
                "temperature":result[0].temperatureSensorState};

            let calibration = await new Calibration(configNumber, currentCampaignId);
            await tcpConnection.calibrateModule(calibration);
            
            //creation of a new thread
            campaignRunner.initCampaign(currentCampaignId,duration,interval,sensorSelected);

            const response: any[] = ["coucou"];
            res.send({"success": response});
        } catch (error) {
            let message = 'Erreur inconnue'
            if (error instanceof Error) message = error.message
            res.status(400).send({"error": message});
            return;
        }
    });
}

