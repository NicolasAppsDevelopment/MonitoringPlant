import { Express, Request, Response } from 'express';
import { sqlConnections } from '../../Database/DatabaseManager';
import { campaign } from '../../Campaign/RunCampaign';
/*
    URL : /test
    METHODE : POST
    CORPS : {"id": 69}
    CONTENT-TYPE : application/json

    DESCRIPTION : test de la connexion
*/
module.exports = function(app: Express){
    app.get('/check_working_campaign', async (req: Request, res: Response) => {
        // Vérifie le corps
        
        // Traite la requête
        try {
            // data.server_id must be send as string or else it will not work
            let result;
            if(campaign.getCurrentCampaign() == undefined ||campaign.getCurrentCampaign() <0){
                result = null;
            }else{
                result = campaign.getCurrentCampaign;
            }

            const response: any[] = [result];
            res.send({"success": response});
        } catch (error) {
            let message = 'Erreur inconnue'
            if (error instanceof Error) message = error.message
            res.status(400).send({"error": message});
            return;
        }
    });
}