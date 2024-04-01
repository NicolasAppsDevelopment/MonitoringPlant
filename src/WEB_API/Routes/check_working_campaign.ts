import { Express, Request, Response } from 'express';
import { sqlConnections } from '../../Database/DatabaseManager';
import { campaignRunner } from '../../Campaign/RunCampaign';
/*
    URL : /check_working_campaign
    METHODE : GET
    CONTENT-TYPE : application/json

    DESCRIPTION : return the id of the campaign currently running or null if no campaign is running.
*/
module.exports = function(app: Express){
    app.get('/check_working_campaign', async (req: Request, res: Response) => {
        // Vérifie le corps
        
        // Traite la requête
        try {
            // data.server_id must be send as string or else it will not work
            let result;
            if (campaignRunner.isRunning()) {
                result = null;
            } else {
                result = campaignRunner.getCurrentCampaignId();
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