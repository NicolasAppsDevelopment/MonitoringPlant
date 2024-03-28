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
    app.get('/check_working_campaign', async (req: Request, res: Response) => {
        // Traite la requête
        try {
            // get the password and ssid of the current access point by reading the hostapd file
            fs.readFile('/etc/hostapd/hostapd.conf', 'utf8', (err, data) => {
                if (err) {
                    res.status(400).send({"error": "Erreur lors de la lecture du fichier de configuration du point d'accès."});
                    return;
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
                const result = {ssid: ssid, password: password};
                res.send({"success": true, "data": result});
            });
        } catch (error) {
            let message = 'Erreur inconnue'
            if (error instanceof Error) message = error.message
            res.status(400).send({"success": false, "error": message});
            return;
        }
    });
}