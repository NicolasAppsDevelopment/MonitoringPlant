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
    app.post('/stop_campaign', async (req: Request, res: Response) => {
        // Vérifie le corps
        let data = req.body;
        if (data.id == null || typeof data.id != "number") {
            res.status(400).send({"error": "Des arguments sont manquants et/ou incorrectes dans le corps de la requête."});
            return;
        }

        // Traite la requête
        try {
            // data.server_id must be send as string or else it will not work
            const sid = data.id;
            if (sid == campaign.getCurrentCampaign){
                campaign.stopCampaign();
            }else{
                res.status(400).send({"error": "wrong campaign number"});
            }
            
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