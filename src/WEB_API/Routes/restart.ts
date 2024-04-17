import { Express, Request, Response } from 'express';
import { exec } from "child_process";
import { logger } from "../../Logger/LoggerManager";

/**
 * URL : /restart
 * METHOD : POST
 * CORPS : {}
 * CONTENT-TYPE : application/json
 * AUTHORIZATION : API_TOKEN (defined in the .env file)
 *
 * DESCRIPTION : Restarts the Raspberry Pi.
 */
module.exports = function(app: Express){
    app.post('/restart', async (req: Request, res: Response) => {
        try {
            exec('sudo reboot', (error, stdout, stderr) => {
                if (error) {
                    logger.error(`error: ${error.message}`);
                    throw new Error("Erreur lors de la tentative de redémarrage de l'appareil. " + error.message);
                }

                if (stderr) {
                    logger.error(`stderr: ${stderr}`);
                    throw new Error("Erreur lors de la tentative de redémarrage de l'appareil. " + stderr);
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
