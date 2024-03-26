import { Express, Request, Response } from 'express';
import { sqlConnections } from '../../Database/DatabaseManager';
import {tcpConnection} from "../../Tcp/TcpManager";
import { fail } from 'assert';
import Calibration from 'src/Campaign/Calibration';
import RunCampaign, { campaign } from 'src/Campaign/RunCampaign';


/*
    URL : /test
    METHODE : POST
    CORPS : {"id": 69}
    CONTENT-TYPE : application/json

    DESCRIPTION : test de la connexion
*/
module.exports = function(app: Express){
    app.post('/createCampaign', async (req: Request, res: Response) => {
        // Vérifie le corps
        let data = req.body;
        
        if (data.id == null || typeof data.id != "number") {
            res.status(400).send({"error": "Des arguments sont manquants et/ou incorrectes dans le corps de la requête."});
            return;
        }
        // Traite la requête
        try {
            // data.server_id must be send as string or else it will not work
            const currentCampaignId = data.id;
            if (data.key === "I_do_believe_I_am_on_fire"){
                sqlConnections.insertLogs(currentCampaignId,0,"Campagne démarrée","La campagne a été démarrée avec succès.");
            }else{
                res.send("wrong request methode");
            } 
            const result = await sqlConnections.queryData("SELECT * FROM Campaigns WHERE idCampaign=?;", [currentCampaignId]);
            
            const interval=result[0].interval;
            const duration=result[0].duration;
            const configNumber=result[0].idConfig;
            const sensorSelected=JSON.parse('{"O2":result[0].O2SensorState,"CO2":result[0].CO2SensorState,"humidity":result[0].humiditySensorState,"light":result[0].luminositySensorState,"temperature":result[0].temperatureSensorState}');

            let calibration=await new Calibration(configNumber,currentCampaignId);
            tcpConnection.sendCommandCalibrate(calibration);
   
            campaign.initCampaign(currentCampaignId,duration,interval,sensorSelected);

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

