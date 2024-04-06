import { Express, Request, Response } from 'express';
import * as fs from 'fs';

/*
    URL : /setAccessPoint
    METHOD : POST
    CORPS : {"ssid": "Cellule de mesure", "password": "test1234"} (ssid or password can be not defined)
    CONTENT-TYPE : application/json
    AUTHORIZATION : API_TOKEN (defined in the .env file)

    DESCRIPTION : Set the ssid and/or password of the current access point.
*/
module.exports = function(app: Express){
    app.post('/setAccessPoint', async (req: Request, res: Response) => {
        try {
            let data = req.body;
        
            if ((data.ssid == null || typeof data.ssid != "string") && (data.password == null || typeof data.password != "string")) {
                throw new Error("Des arguments sont manquants et/ou incorrectes dans le corps de la requête.");
            }
    
            const ssid = data.ssid;
            const password = data.password;

            // set the password and ssid of the current access point by reading/writing to the hostapd file for ssid and wpa_passphrase
            fs.readFile('/etc/hostapd/hostapd.conf', 'utf8', (err, data) => {
                if (err) {
                    throw new Error("Erreur lors de la lecture du fichier de configuration du point d'accès.");
                }

                let lines = data.split('\n');
                let newLines: string[] = [];
                
                lines.forEach((line) => {
                    if (line.startsWith('ssid=') && ssid != null) {
                        newLines.push('ssid=' + ssid);
                    } else if (line.startsWith('wpa_passphrase=') && password != null) {
                        newLines.push('wpa_passphrase=' + password);
                    } else {
                        newLines.push(line);
                    }
                });

                fs.writeFile('/etc/hostapd/hostapd.conf', newLines.join('\n'), (err) => {
                    if (err) {
                        throw new Error("Erreur lors de l'écriture du fichier de configuration du point d'accès.");
                    }
                    res.send({"success": true});
                });
            });
            
        } catch (error) {
            let message = 'Erreur inconnue'
            if (error instanceof Error) message = error.message
            res.status(400).send({"success": false, "error": message});
            return;
        }
    });
}

