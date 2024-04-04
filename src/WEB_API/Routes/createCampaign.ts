import { Express, Request, Response } from 'express';
import RunCampaign, { campaignRunner } from '../../Campaign/RunCampaign';


/*
    URL : /createCampaign
    METHODE : POST
    CORPS : {"id": 69}
    CONTENT-TYPE : application/json

    DESCRIPTION : initialise a campaign and run it
*/
module.exports = function(app: Express){
    app.post('/createCampaign', async (req: Request, res: Response) => {
        try {
            let data = req.body;
        
            if (data.id == null || typeof data.id != "number") {
                throw new Error("Des arguments sont manquants et/ou incorrectes dans le corps de la requête.");
            }

            if (campaignRunner.isRunning()) {
                throw new Error("Une campagne est déjà en cours d'éxecution.");
            }

            await campaignRunner.initCampaign(data.id);
            res.send({"success": true});
        } catch (error) {
            let message = 'Erreur inconnue'
            if (error instanceof Error) message = error.message
            res.status(400).send({"error": message});
            return;
        }
    });
}

