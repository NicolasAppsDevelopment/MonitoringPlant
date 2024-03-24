import { sqlConnections } from '../Database/DatabaseManager';
import { NextFunction, Request, Response } from 'express';
export async function isAuth(req: Request, res: Response, next: NextFunction) {
    // Vérifie la présence d'un token
    /*let tokenCredential = req.headers.authorization;
    if (tokenCredential == null) {
        res.status(401).send({"error": "L'en-tête \"Authorization\" est manquante/vide."});
        return;
    }*/

    // Vérifie le corps
    if (!req.is('application/json')) {
        res.status(500).send({"error": "L'en-tête \"Content-Type\" doit être défini sur \"application/json\"."});
        return;
    }
    next();
    
    /*let data = req.body;
    if (data == null || data.id == null || typeof data.id != "number") {
        res.status(400).send({"error": "L'argument \"id\" est manquant et/ou incorrecte dans le corps de la requête."});
        return;
    }*/
    
    // Vérifie le token
    /*try {
        const results = await sqlConnections.queryData("SELECT ... FROM ... WHERE id = 1 AND t0 = ? AND t1 = ?;", [data.var1, var2]);
        if (results.length == 1) {
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
    }*/
}