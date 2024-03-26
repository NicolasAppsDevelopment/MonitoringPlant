import { sqlConnections } from '../Database/DatabaseManager';
import { NextFunction, Request, Response } from 'express';
import { config } from "dotenv";

// Chargement des variables d'environnement
config();

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
        if (tokenCredential === process.env.API_PORT) {
            // C'est bon
            next();
            return;
        } else {
            // Pas bon
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