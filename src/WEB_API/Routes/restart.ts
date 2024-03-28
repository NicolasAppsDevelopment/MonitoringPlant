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

        // Traite la requête
        try {
            

            res.send({"success": "true"});
        } catch (error) {
            let message = 'Erreur inconnue'
            if (error instanceof Error) message = error.message
            res.status(400).send({"error": message});
            return;
        }
    });
}