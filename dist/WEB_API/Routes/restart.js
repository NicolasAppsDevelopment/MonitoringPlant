"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const LoggerManager_1 = require("../../Logger/LoggerManager");
/*
    URL : /test
    METHODE : POST
    CORPS : {"id": 69}
    CONTENT-TYPE : application/json

    DESCRIPTION : test de la connexion
*/
module.exports = function (app) {
    app.post('/restart', async (req, res) => {
        // Traite la requête
        try {
            let result = (0, child_process_1.exec)('sudo reboot', (error, stdout, stderr) => {
                if (error) {
                    LoggerManager_1.logger.error(`error: ${error.message}`);
                    res.send({ "success": "false" });
                    return;
                }
                if (stderr) {
                    LoggerManager_1.logger.error(`stderr: ${stderr}`);
                    return;
                }
            });
            res.send({ "success": "true" });
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
