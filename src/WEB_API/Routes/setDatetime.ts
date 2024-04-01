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
    app.post('/set_datetime', async (req: Request, res: Response) => {
        
        let data = req.body;
        if (data.datetime == null ) {
            res.status(400).send({"error": "Des arguments sont manquants et/ou incorrectes dans le corps de la requête."});
            return;
        }

        // Traite la requête
        try {
            let date = " \"" + data.datetime + '"';

            let result= exec('sudo date -s'+date, (error, stdout, stderr) => {
                if (error) {
                    logger.error(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    logger.error(`stderr: ${stderr}`);
                    return;
                }
            });
            res.send({"success": "true"});
        } catch (error) {
            let message = 'Erreur inconnue'
            if (error instanceof Error) message = error.message
            res.status(400).send({"error": message});
            return;
        }
    });
}