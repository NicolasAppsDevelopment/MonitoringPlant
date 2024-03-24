"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertLogs = exports.initSqlConnections = void 0;
const dotenv_1 = require("dotenv");
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
        (0, dotenv_1.config)();
        if (this.connection !== null)
            return this;
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
        return this;
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
}
exports.default = Database;
function initSqlConnections() {
    exports.sqlConnections = new Database();
    exports.sqlConnections.open();
}
exports.initSqlConnections = initSqlConnections;
function insertLogs(idCampaign, title, msg) {
    let now = new Date();
    let query = "insert into Logs values(" + idCampaign + "," + title + "," + msg + "," + now + ");";
    exports.sqlConnections.queryData(query, undefined);
}
exports.insertLogs = insertLogs;
