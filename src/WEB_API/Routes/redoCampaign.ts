import { Express, Request, Response } from 'express';
import { sqlConnections } from '../../Database/DatabaseManager';
import RunCampaign, { campaignRunner } from '../../Campaign/RunCampaign';

/*
    URL : /redo_campaign
    METHODE : POST
    CORPS : {"id": 69}
    CONTENT-TYPE : application/json

    DESCRIPTION : Restart a campaign from the start.
*/
module.exports = function(app: Express){
    app.post('/redo_campaign', async (req: Request, res: Response) => {
        let data = req.body;
        if (data.id == null || typeof data.id != "number") {
            res.status(400).send({"error": "Des arguments sont manquants et/ou incorrectes dans le corps de la requête."});
            return;
        }
        try {
            const currentCampaignId = data.id;
            let result = await campaignRunner.restartCampaign(data.id);

            res.send({"success": result});
        } catch (error) {
            let message = 'Erreur inconnue'
            if (error instanceof Error) message = error.message
            res.status(400).send({"error": message});
            return;
        }
    });
}