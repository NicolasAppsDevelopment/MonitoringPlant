"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const dotenv_1 = require("dotenv");
// Chargement des variables d'environnement
(0, dotenv_1.config)();
async function isAuth(req, res, next) {
    // Vérifie la présence d'un token
    let tokenCredential = req.headers.authorization;
    if (tokenCredential == null) {
        res.status(401).send({ "error": "L'en-tête \"Authorization\" est manquante/vide." });
        return;
    }
    // Vérifie le corps
    if (!req.is('application/json')) {
        res.status(500).send({ "error": "L'en-tête \"Content-Type\" doit être défini sur \"application/json\"." });
        return;
    }
    // Vérifie le token
    try {
        if (tokenCredential === process.env.API_TOKEN) {
            // C'est bon
            next();
            return;
        }
        else {
            // Pas bon
            res.status(401).send({ "error": "L'autorisation a échoué." });
            return;
        }
    }
    catch (error) {
        let message = 'Erreur inconnue';
        if (error instanceof Error)
            message = error.message;
        res.status(500).send({ "error": "Impossible de vérifier l'autorisation : " + message });
        return;
    }
}
exports.isAuth = isAuth;
