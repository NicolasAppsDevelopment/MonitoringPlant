import { Express, Request, Response } from 'express';
import RunCampaign, { campaignRunner } from '../../Campaign/RunCampaign';
import { logger } from "../../Logger/LoggerManager";

/*
    URL : /removeCampaign
    METHODE : POST
    CORPS : {"id": 69}
    CONTENT-TYPE : application/json

    DESCRIPTION : send a message to the RunCampaign to stop it after deleting a campaign from the database if necessary
*/
module.exports = function(app: Express){
    app.post('/removeCampaign', async (req: Request, res: Response)=>{
        let data = req.body;
        if (data.id == null || typeof data.id != "number") {
            res.status(400).send({"error": "Des arguments sont manquants et/ou incorrectes dans le corps de la requête."});
            return;
        }
        // Traite la requête
        campaignRunner.removeCampaign(data.id);
        res.send({"success": "true"});
    });

        
}