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
    app.get('/storage', async (req, res) => {
        // Traite la requête
        try {
            let result = (0, child_process_1.exec)('df --block-size=KB --output=size --output=used /root', (error, stdout, stderr) => {
                if (error) {
                    LoggerManager_1.logger.error(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    LoggerManager_1.logger.error(`stderr: ${stderr}`);
                    return;
                }
                let split = stdout.split("\n");
                let data = split[1].split(" ");
                let total = parseInt(data[1].replace("kB", ""));
                var used = parseInt(data[2].replace("kB", ""));
                var maxHours = ((total - used) / 1497.6);
                var used_percent = (used / total) * 100.0;
                maxHours = Math.floor(maxHours);
                return '{"success":true, "used":' + used + ', "total": ' + total + '}';
                console.log(`stdout: ${stdout}`);
            });
            LoggerManager_1.logger.debug(result);
            if (result == undefined) {
                res.send({ "error": "an error occured during the process" });
            }
            else {
                const response = [result.stdout?.toArray()];
                res.send({ "success": response });
            }
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
