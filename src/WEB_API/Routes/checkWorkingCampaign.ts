import { Express, Request, Response } from 'express';
import { campaignRunner } from '../../Campaign/RunCampaign';

/*
    URL : /checkWorkingCampaign
    METHOD : GET

    DESCRIPTION : Returns the current campaign id if a campaign is running (null otherwise).
    RETURNS :
        - success : true if the campaign is running
        - idCurrent : the id of the current campaign
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