import { Express, Request, Response } from 'express';
import { campaignRunner } from '../../Campaign/RunCampaign';
/*
    URL : /check_working_campaign
    METHODE : GET
    CONTENT-TYPE : application/json

    DESCRIPTION : return the id of the campaign currently running or null if no campaign is running.
*/
module.exports = function(app: Express){
    app.get('/checkWorkingCampaign', async (req: Request, res: Response) => {
        try {
            let currentCampaignId = null;
            if (campaignRunner.isRunning() && campaignRunner.getCurrentCampaignId() != -1) {
                currentCampaignId = campaignRunner.getCurrentCampaignId();
            }
            
            res.send({"success": true,"idCurrent":currentCampaignId});
        } catch (error) {
            let message = 'Erreur inconnue'
            if (error instanceof Error) message = error.message
            res.status(400).send({"sucess": false, "error":message});
            return;
        }
    });
}