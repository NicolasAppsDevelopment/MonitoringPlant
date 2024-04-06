import { Express, Request, Response } from 'express';
import { campaignRunner } from '../../Campaign/RunCampaign';

/*
    URL : /redoCampaign
    METHOD : POST
    CORPS : {"id": 69}
    CONTENT-TYPE : application/json
    AUTHORIZATION : API_TOKEN (defined in the .env file)

    DESCRIPTION : Restart a campaign specified with the given id.
*/
module.exports = function(app: Express){
    app.post('/redoCampaign', async (req: Request, res: Response) => {
        try {
            let data = req.body;
            if (data.id == null || typeof data.id != "number") {
                throw new Error("Des arguments sont manquants et/ou incorrectes dans le corps de la requête."); 
            }

            if (campaignRunner.isRunning() && campaignRunner.getCurrentCampaignId() != data.id){
                throw new Error("Une autre campagne est déjà en cours d'éxecution.");
            }

            await campaignRunner.restartCampaign(data.id);
            res.send({"success": true});
        } catch (error) {
            let message = 'Erreur inconnue'
            if (error instanceof Error) message = error.message
            res.status(400).send({"error": message});
            return;
        }
    });
}