import { NextFunction, Request, Response } from 'express';
import { loadConfig } from "../Helper/loadConfig";
import { logger } from '../Logger/LoggerManager';

// Chargement des variables d'environnement
loadConfig();
if (!process?.env?.API_TOKEN) {
    throw new Error("Le token de l'API n'est pas défini dans le fichier .env");
}

export async function isAuth(req: Request, res: Response, next: NextFunction) {
    // Vérifie la présence d'un token
    let tokenCredential = req.headers.authorization;
    if (tokenCredential == null) {
        res.status(401).send({"error": "L'en-tête \"Authorization\" est manquante/vide."});
        return;
    }

    // Vérifie le corps
    if (!req.is('application/json')) {
        res.status(500).send({"error": "L'en-tête \"Content-Type\" doit être défini sur \"application/json\"."});
        return;
    }
    
    // Vérifie le token
    try {
        if (tokenCredential === process.env.API_TOKEN) {
            // C'est bon
            next();
            return;
        } else {
            // Pas bon
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