"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const loadConfig_1 = require("../Helper/loadConfig");
const LoggerManager_1 = require("../Logger/LoggerManager");
// Chargement des variables d'environnement
(0, loadConfig_1.loadConfig)();
if (!process?.env?.API_TOKEN) {
    throw new Error("Le token de l'API n'est pas défini dans le fichier .env");
}
const AUTHORIZED_PATHS_WITOUT_TOKEN = [
    '/storage',
    '/getQRCode',
    '/checkWorkingCampaign'
];
async function isAuth(req, res, next) {
    // Vérifie le corps pour les requêtes POST
    if (req.method !== 'GET' && !req.is('application/json')) {
        res.status(500).send({ "error": "L'en-tête \"Content-Type\" doit être défini sur \"application/json\"." });
        return;
    }
    // Vérifie si le chemin est autorisé sans token
    if (AUTHORIZED_PATHS_WITOUT_TOKEN.includes(req.path)) {
        next();
        return;
    }
    // ... sinon, vérifie la présence d'un token
    let tokenCredential = req.headers.authorization;
    if (tokenCredential == null) {
        res.status(401).send({ "error": "L'en-tête \"Authorization\" est manquante/vide." });
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
            LoggerManager_1.logger.warn(process.env.API_TOKEN);
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
