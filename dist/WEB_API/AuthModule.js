"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const loadConfig_1 = require("../Helper/loadConfig");
const LoggerManager_1 = require("../Logger/LoggerManager");
// Load the configuration file
(0, loadConfig_1.loadConfig)();
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
async function isAuth(req, res, next) {
    // Check the content type if it's not a GET request
    if (req.method !== 'GET' && !req.is('application/json')) {
        res.status(500).send({ "error": "L'en-tête \"Content-Type\" doit être défini sur \"application/json\"." });
        return;
    }
    // Check if the path is authorized without token
    if (AUTHORIZED_PATHS_WITOUT_TOKEN.includes(req.path)) {
        next();
        return;
    }
    // ... and if it's not, check the presence of the token
    let tokenCredential = req.headers.authorization;
    if (tokenCredential == null) {
        res.status(401).send({ "error": "L'en-tête \"Authorization\" est manquante/vide." });
        return;
    }
    // Check the token
    try {
        if (tokenCredential === process.env.API_TOKEN) {
            // All good
            next();
            return;
        }
        else {
            // Not authorized
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
