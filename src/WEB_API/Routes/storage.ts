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
                let total= parseInt(data[0].replace("kB", ""));
                var used = parseInt(data[1].replace("kB", ""));
                var maxHours = ((total - used) / 1497.6);
                var used_percent = (used / total) * 100.0;
                maxHours=Math.floor(maxHours);
                return '{"used":' + used + ', "total": ' + total + '}';
                console.log(`stdout: ${stdout}`);
            });
            logger.debug(result);
            if (result == undefined){
                res.send({"error":"an error occured during the process" });
            }else{
                const response: any[] = [result];
                res.send({"success": response});
            }
        } catch (error) {
            let message = 'Erreur inconnue'
            if (error instanceof Error) message = error.message
            res.status(400).send({"error": message});
            return;
        }
    });
}