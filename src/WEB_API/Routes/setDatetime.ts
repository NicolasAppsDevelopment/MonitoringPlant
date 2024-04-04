import { Express, Request, Response } from 'express';
import { exec } from "child_process";
import { logger } from "../../Logger/LoggerManager";

/*
    URL : /test
    METHODE : POST
    CORPS : {"datetime": "1789-09-01 18:00"}
    CONTENT-TYPE : application/json

    DESCRIPTION : set the time of the raspberry pi to the hour of the users device
*/
module.exports = function(app: Express){
    app.post('/setDatetime', async (req: Request, res: Response) => {
        let data = req.body;
        if (data.datetime == null ) {
            throw new Error("Des arguments sont manquants et/ou incorrectes dans le corps de la requête.");
        }

        // Traite la requête
        try {
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