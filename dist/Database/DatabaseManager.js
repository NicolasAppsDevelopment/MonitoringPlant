"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSqlConnections = void 0;
const loadConfig_1 = require("../Helper/loadConfig");
const mysql2_1 = __importDefault(require("mysql2"));
const LoggerManager_1 = require("../Logger/LoggerManager");
class Database {
    connection;
    constructor() {
        this.connection = null;
    }
    open() {
        LoggerManager_1.logger.info("Ouverture d'une nouvelle connexion à la base de données.");
        // Chargement des variables d'environnement
        (0, loadConfig_1.loadConfig)();
        if (!process?.env?.DATABASE_HOST) {
            throw new Error("L'hôte de la base de données n'est pas défini dans le fichier .env");
        }
        if (!process?.env?.DATABASE_USER_NAME) {
            throw new Error("Le nom d'utilisateur de la base de données n'est pas défini dans le fichier .env");
        }
        if (!process?.env?.DATABASE_NAME) {
            throw new Error("Le nom de la base de données n'est pas défini dans le fichier .env");
        }
        if (!process?.env?.DATABASE_PASSWORD) {
            throw new Error("Le mot de passe de la base de données n'est pas défini dans le fichier .env");
        }
        this.connection = mysql2_1.default.createPool({
            host: process?.env?.DATABASE_HOST,
            user: process?.env?.DATABASE_USER_NAME,
            database: process?.env?.DATABASE_NAME,
            password: process?.env?.DATABASE_PASSWORD,
            waitForConnections: true,
            multipleStatements: false,
            connectionLimit: 10
        });
        LoggerManager_1.logger.info("Ouverture terminé.");
    }
    close() {
        LoggerManager_1.logger.info("Fermeture de la connexion à la base de données.");
        if (this.connection) {
            this.connection.end();
            this.connection = null;
        }
        LoggerManager_1.logger.info("Connexion fermé.");
    }
    restart() {
        this.close();
        this.open();
    }
    queryData(sql, params) {
        return new Promise((resolve, reject) => {
            if (!this.connection) {
                return reject("connection n'est pas défini.");
            }
            this.connection.query(sql, params || [], (error, results) => {
                if (error) {
                    return reject("Oups ! La requête avec la base de données à échouée : " + error + "\nSQL demandé: " + sql + "\nParam: " + params);
                }
                return resolve(results || []);
            });
        });
    }
    async insertLogs(idCampaign, state, title, msg) {
        let now = new Date();
        let query = "insert into Logs values(?,?, ?,? ,?);";
        try {
            await this.queryData(query, [idCampaign, state, title, msg, now]);
        }
        catch (error) {
            LoggerManager_1.logger.error("Erreur lors de l'insertion des logs dans la base de données : " + error);
        }
    }
    async setAlertLevel(idCampaign, alertLevel) {
        let query = "update Campaigns set alertLevel= ? where idCampaign=?;";
        try {
            await this.queryData(query, [alertLevel, idCampaign]);
        }
        catch (error) {
            LoggerManager_1.logger.error("Erreur lors de la mise à jour de la campagne dans la base de données : " + error);
        }
    }
    async setFinished(idCampaign) {
        let now = new Date();
        let query = "update Campaigns set finished=1,endingDate= ? where idCampaign=?;";
        try {
            await this.queryData(query, [now, idCampaign]);
        }
        catch (error) {
            LoggerManager_1.logger.error("Erreur lors de la mise à jour de la campagne dans la base de données : " + error);
        }
    }
}
exports.default = Database;
function initSqlConnections() {
    exports.sqlConnections = new Database();
    try {
        exports.sqlConnections.open();
    }
    catch (error) {
        LoggerManager_1.logger.error("Failed to open database: " + error);
    }
}
exports.initSqlConnections = initSqlConnections;
