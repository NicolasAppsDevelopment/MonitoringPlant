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
    app.get('/storage', async (req: Request, res: Response) => {
        
        // Traite la requête
        try {
            let result= exec('df --block-size=KB --output=size --output=used /root', (error, stdout, stderr) => {
                if (error) {
                    logger.error(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    logger.error(`stderr: ${stderr}`);
                    return;
                }
                let split= stdout.split("\n");
                let data = split[1].split(" ");
                let total= parseInt(data[1].replace("kB", ""));
                const used = parseInt(data[2].replace("kB", ""));
                const maxHours = Math.floor((total - used) / 1497.6);
                return {"used": used, "total": total, "maxHours": maxHours};
            });

            if (result == undefined){
                res.send({"error":"An error occured during the process" });
            } else {
                res.send({"success": true, "data": result});
            }
        } catch (error) {
            let message = 'Erreur inconnue'
            if (error instanceof Error) message = error.message
            res.status(400).send({"error": message});
            return;
        }
    });
}