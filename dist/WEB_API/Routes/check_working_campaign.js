"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RunCampaign_1 = require("../../Campaign/RunCampaign");
/*
    URL : /test
    METHODE : POST
    CORPS : {"id": 69}
    CONTENT-TYPE : application/json

    DESCRIPTION : test de la connexion
*/
module.exports = function (app) {
    app.get('/check_working_campaign', async (req, res) => {
        // Vérifie le corps
        let data = req.body;
        if (data.id == null || typeof data.id != "number") {
            res.status(400).send({ "error": "Des arguments sont manquants et/ou incorrectes dans le corps de la requête." });
            return;
        }
        // Traite la requête
        try {
            // data.server_id must be send as string or else it will not work
            let result;
            if (RunCampaign_1.campaign.getCurrentCampaign() < 0) {
                result = null;
            }
            else {
                result = RunCampaign_1.campaign.getCurrentCampaign;
            }
            const response = [result];
            res.send({ "success": response });
        }
        catch (error) {
            let message = 'Erreur inconnue';
            if (error instanceof Error)
                message = error.message;
            res.status(400).send({ "error": message });
            return;
        }
    });
};
