import { Express, Request, Response } from 'express';
import { sqlConnections } from '../../Database/DatabaseManager';
import { tcpConnection } from "../../Tcp/TcpManager";
import Calibration from '../../Campaign/Calibration';
import RunCampaign, { campaignRunner } from '../../Campaign/RunCampaign';
import { logger } from "../../Logger/LoggerManager";


/*
    URL : /createCampaign
    METHODE : POST
    CORPS : {"id": 69}
    CONTENT-TYPE : application/json

    DESCRIPTION : initialise a campaign and run it
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

            let o2:boolean;
            let co2:boolean;
            let luminosity:boolean;
            let humidity:boolean;
            let temperature:boolean;

            if(result[0].O2SensorState == 1){
                o2 = true;
            }else{
                 o2 = false;
            }
            if(result[0].CO2SensorState == 1){
                co2 = true;
            }else{
                 co2 = false;
            }
            if(result[0].humiditySensorState == 1){
                luminosity = true;
            }else{
                luminosity = false;
            }
            if(result[0].luminositySensorState == 1){
                humidity = true;
            }else{
                humidity = false;
            }
            if(result[0].temperatureSensorState == 1){
                temperature = true;
            }else{
                temperature = false;
            }

            const sensorSelected={
                "o2":o2,
                "co2":co2,
                "humidity":humidity,
                "luminosity":luminosity,
                "temperature":temperature
            };

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

