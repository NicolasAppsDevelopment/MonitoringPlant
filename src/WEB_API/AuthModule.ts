import { NextFunction, Request, Response } from 'express';
import { loadConfig } from "../Helper/loadConfig";
import { logger } from '../Logger/LoggerManager';

// Load the configuration file
loadConfig();
if (!process?.env?.API_TOKEN) {
    throw new Error("Le token de l'API n'est pas défini dans le fichier .env");
}

const AUTHORIZED_PATHS_WITOUT_TOKEN = [
    '/storage',
    '/getQRCode',
    '/getAccessPoint',
    '/checkWorkingCampaign'
];

/**
 * Middleware to check if the request is authorized
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export async function isAuth(req: Request, res: Response, next: NextFunction) {
    // Checks the content type if it's not a GET request
    if (req.method !== 'GET' && !req.is('application/json')) {
        res.status(500).send({"error": "L'en-tête \"Content-Type\" doit être défini sur \"application/json\"."});
        return;
    }
    
    // Checks if the path is authorized without token
    if (AUTHORIZED_PATHS_WITOUT_TOKEN.includes(req.path)) {
        next();
        return;
    }

    // ... and if it's not, check the presence of the token
    let tokenCredential = req.headers.authorization;
    if (tokenCredential == null) {
        res.status(401).send({"error": "L'en-tête \"Authorization\" est manquante/vide."});
        return;
    }
    
    // Checks the token
    try {
        if (tokenCredential === process.env.API_TOKEN) {
            // All good
            next();
            return;
        } else {
            // Not authorized
            logger.warn(process.env.API_TOKEN);
            res.status(401).send({"error": "L'autorisation a échoué."});
            return;
        }
    } catch (error) {
        let message = 'Erreur inconnue'
        if (error instanceof Error) message = error.message
        res.status(500).send({"error": "Impossible de vérifier l'autorisation : " + message});
        return;
    }
}