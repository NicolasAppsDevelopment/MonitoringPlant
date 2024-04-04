import { Express, Request, Response } from 'express';
import { sqlConnections } from '../../Database/DatabaseManager';
import { campaignRunner } from '../../Campaign/RunCampaign';
/*
    URL : /stop_campaign
    METHODE : POST
    CORPS : {"id": 69}
    CONTENT-TYPE : application/json

    DESCRIPTION : stop a campaign currently running
*/
module.exports = function(app: Express){
    app.post('/stopCampaign', async (req: Request, res: Response) => {
        try {
            let data = req.body;
            if (data.id == null || typeof data.id != "number") {
                throw new Error("Des arguments sont manquants et/ou incorrectes dans le corps de la requête.");
            }
            
            await campaignRunner.stopCampaign(data.id);
            res.send({"success": true});
        } catch (error) {
            let message = 'Erreur inconnue'
            if (error instanceof Error) message = error.message
            res.status(400).send({"error": message});
            return;
        }
    });
}