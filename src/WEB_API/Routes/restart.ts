import { Express, Request, Response } from 'express';
import { exec } from "child_process";
import { logger } from "../../Logger/LoggerManager";

/*
    URL : /test
    METHODE : POST
    CORPS : {"id": 69}
    CONTENT-TYPE : application/json

    DESCRIPTION : test de la connexion
*/
module.exports = function(app: Express){
    app.post('/restart', async (req: Request, res: Response) => {
        
        let data = req.body;
        if (data.key == null || data.key!= String ) {
            res.status(400).send({"error": "Des arguments sont manquants et/ou incorrectes dans le corps de la requête."});
            return;
        }

        // Traite la requête
        try {
            let result= exec('sudo reboot', (error, stdout, stderr) => {
                if (error) {
                    logger.error(`error: ${error.message}`);
                    res.send({"success": "false"});
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