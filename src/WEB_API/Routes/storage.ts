import { Express, Request, Response } from 'express';
import { exec } from "child_process";
import { logger } from "../../Logger/LoggerManager";

/*
    URL : /storage
    METHODE : GET

    DESCRIPTION : getting total storage and storage left from the Raspberry Pi.
    RETURN : 
        - success : true if the storage was retrieved successfully
        - data : 
            - used : the storage used in KB
            - total : the total storage in KB
            - maxHours : the maximum number of hours that can be recorded on the Raspberry P
*/
module.exports = function(app: Express){
    app.get('/storage', async (req: Request, res: Response) => {
        try {
            exec('df --block-size=KB --output=size --output=used /root', (error, stdout, stderr) => {
                if (error) {
                    logger.error(`error: ${error.message}`);
                    throw new Error("Erreur lors de la récupération de l'espace de stockage. " + error.message);
                }
                
                if (stderr) {
                    logger.error(`stderr: ${stderr}`);
                    throw new Error("Erreur lors de la récupération de l'espace de stockage. " + stderr);
                }

                let split= stdout.split("\n");
                let data = split[1].split(" ");
                let total= parseInt(data[1].replace("kB", ""));
                const used = parseInt(data[2].replace("kB", ""));
                const maxHours = Math.floor((total - used) / 1497.6);

                res.send({"success": true, "data": {"used": used, "total": total, "maxHours": maxHours}});
            });
        } catch (error) {
            let message = 'Erreur inconnue'
            if (error instanceof Error) message = error.message
            res.status(400).send({"error": message});
            return;
        }
    });
}