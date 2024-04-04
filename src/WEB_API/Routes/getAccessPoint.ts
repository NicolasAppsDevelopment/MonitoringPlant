import { Express, Request, Response } from 'express';
import * as fs from 'fs';

/*
    URL : /test
    METHODE : POST
    CORPS : {"id": 69}
    CONTENT-TYPE : application/json

    DESCRIPTION : test de la connexion
*/
module.exports = function(app: Express){
    app.get('/getAccessPoint', async (req: Request, res: Response) => {
        try {
            // get the password and ssid of the current access point by reading the hostapd file
            fs.readFile('/etc/hostapd/hostapd.conf', 'utf8', (err, data) => {
                if (err) {
                    throw new Error("Erreur lors de la lecture du fichier de configuration du point d'accès.");
                }

                let ssid = '';
                let password = '';
                
                data.split('\n').forEach((line) => {
                    if (line.startsWith('ssid=')) {
                        ssid = line.split('=')[1];
                    } else if (line.startsWith('wpa_passphrase=')) {
                        password = line.split('=')[1];
                    }
                });

                res.send({"success": true, "data": {"ssid": ssid, "password": password}});
            });
        } catch (error) {
            let message = 'Erreur inconnue'
            if (error instanceof Error) message = error.message
            res.status(400).send({"success": false, "error": message});
            return;
        }
    });
}