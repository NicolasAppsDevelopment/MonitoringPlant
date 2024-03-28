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
    app.post('/set_datetime', async (req, res) => {
        let data = req.body;
        if (data.datetime == null) {
            res.status(400).send({ "error": "Des arguments sont manquants et/ou incorrectes dans le corps de la requête." });
            return;
        }
        // Traite la requête
        try {
            let date = " \"" + data.datetime + '"';
            let result = (0, child_process_1.exec)('sudo date -s' + date, (error, stdout, stderr) => {
                if (error) {
                    LoggerManager_1.logger.error(`error: ${error.message}`);
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
