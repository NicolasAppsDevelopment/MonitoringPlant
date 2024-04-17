import { Express, Request, Response } from 'express';
import { exec } from "child_process";
import { logger } from "../../Logger/LoggerManager";

/**
 * URL : /setDatetime
 * METHOD : POST
 * CORPS : {"datetime": "1789-09-01 18:00:00"}
 * CONTENT-TYPE : application/json
 * AUTHORIZATION : API_TOKEN (defined in the .env file)
 *
 * DESCRIPTION : Sets the time of the Raspberry Pi to the specified date and time.
 */
module.exports = function(app: Express){
    app.post('/setDatetime', async (req: Request, res: Response) => {
        let data = req.body;
        
        try {
            if (data.datetime == null ) {
                throw new Error("Des arguments sont manquants et/ou incorrectes dans le corps de la requête.");
            }

            let date = " \"" + data.datetime + '"';

            exec('sudo date -s'+date, (error, stdout, stderr) => {
                if (error) {
                    logger.error(`error: ${error.message}`);
                    throw new Error("Erreur lors de la modification de la date et de l'heure. " + error.message);
                }

                if (stderr) {
                    logger.error(`stderr: ${stderr}`);
                    throw new Error("Erreur lors de la modification de la date et de l'heure. " + stderr);
                }
            });
            
            res.send({"success": true});
        } catch (error) {
            let message = 'Erreur inconnue'
            if (error instanceof Error) message = error.message
            res.status(400).send({"error": message});
            return;
        }
    });
}