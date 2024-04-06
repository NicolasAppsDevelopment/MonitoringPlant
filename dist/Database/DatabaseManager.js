"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSqlConnections = void 0;
const loadConfig_1 = require("../Helper/loadConfig");
const mysql2_1 = __importDefault(require("mysql2"));
const LoggerManager_1 = require("../Logger/LoggerManager");
const RunCampaign_1 = require("../Campaign/RunCampaign");
/**
 * Class to manage the connection to the database.
 */
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
    /**
     * Execute a SQL query on the database
     * @param sql The SQL query to execute
     * @param params Array of parameters to pass to the query
     * @returns A promise that will resolve with the result of the query
     * @note You must await this function to get the result of the query
     */
    queryData(sql, params) {
        return new Promise((resolve, reject) => {
            if (!this.connection) {
                return reject(new Error("connection n'est pas défini."));
            }
            this.connection.query(sql, params || [], (error, results) => {
                if (error) {
                    return reject(new Error("Oups ! La requête avec la base de données à échouée : " + error + "\nSQL demandé: " + sql + "\nParam: " + params));
                }
                return resolve(results || []);
            });
        });
    }
    /**
     * Insert a new log in the database
     * @param idCampaign The id of the campaign where the log need to be inserted
     * @param state The state of the log (see LogLevelCode for more information)
     * @param title The title of the log
     * @param msg The message of the log
     * @param date The date of the log (default: now)
     */
    async insertLogs(idCampaign, state, title, msg, date = new Date()) {
        let query = "insert into Logs values(?,?, ?,? ,?);";
        try {
            await this.queryData(query, [idCampaign, state, title, msg, date]);
        }
        catch (error) {
            LoggerManager_1.logger.error("Erreur lors de l'insertion des logs dans la base de données : " + error);
        }
    }
    /**
     * Update the campaign state in the database
     * @param idCampaign The id of the campaign to update
     * @param alertLevel The new state level of the campaign (see CampaignStateLevelCode for more information)
     */
    async setAlertLevel(idCampaign, alertLevel) {
        let query = "update Campaigns set alertLevel=? where idCampaign=?;";
        try {
            await this.queryData(query, [alertLevel, idCampaign]);
        }
        catch (error) {
            LoggerManager_1.logger.error("Erreur lors de la mise à jour de la campagne dans la base de données : " + error);
        }
    }
    /**
     * Update the campaign finised state in the database.
     * It will also update the ending or begining date in the corresponding case.
     * @param idCampaign The id of the campaign to update
     * @param finished True if the campaign is finished, else false
     */
    async setFinished(idCampaign, finished) {
        let updateDateQuery;
        if (finished) {
            updateDateQuery = ", endingDate=NOW()";
            console.log("Campaign finished");
        }
        else {
            updateDateQuery = ", beginDate=NOW()";
        }
        let query = "UPDATE Campaigns SET finished=?" + updateDateQuery + " WHERE idCampaign=?;";
        try {
            await this.queryData(query, [+finished, idCampaign]);
        }
        catch (error) {
            LoggerManager_1.logger.error("Erreur lors de la mise à jour de la campagne dans la base de données : " + error);
        }
    }
    /**
     * Insert a new measure in the database
     * @param idCampaign The id of the campaign where the measure need to be inserted
     * @param sensorData The data to insert in the database (see TcpDaemonMeasurement for more information)
     * @param sensorStates The state of the sensors (see SensorStates for more information)
     */
    async insertMeasure(idCampaign, sensorData, sensorStates) {
        let values = "";
        if (sensorStates.temperature) {
            values += sensorData.temperature + ",";
        }
        else {
            values += "NULL,";
        }
        if (sensorStates.co2) {
            values += sensorData.CO2 + ",";
        }
        else {
            values += "NULL,";
        }
        if (sensorStates.o2) {
            values += sensorData.O2 + ",";
        }
        else {
            values += "NULL,";
        }
        if (sensorStates.humidity) {
            values += sensorData.humidity + ",";
        }
        else {
            values += "NULL,";
        }
        if (sensorStates.luminosity) {
            values += sensorData.luminosity;
        }
        else {
            values += "NULL";
        }
        let query = "INSERT INTO Measurements values(?," + values + ",NOW());";
        await this.queryData(query, [idCampaign]);
    }
    /**
     * Get the information of a campaign from the database
     * @param idCampaign id of the campaign to get information
     * @returns CampaignQueryAnswer object with the information of the campaign (see CampaignQueryAnswer for more information)
     */
    async getCampaignInfo(idCampaign) {
        const campaignsData = await exports.sqlConnections.queryData("SELECT * FROM Campaigns WHERE idCampaign = ? ;", [idCampaign]);
        if (campaignsData.length == 0) {
            throw new Error("La campagne n'existe pas.");
        }
        return campaignsData[0];
    }
    /**
     * Get all the campaigns that are currently running
     * @returns An array of CampaignQueryAnswer with the information of the campaigns (see CampaignQueryAnswer for more information)
     */
    async getRunningCampaigns() {
        return await this.queryData("SELECT * FROM Campaigns WHERE finished = 0;");
    }
    /**
     * Get the calibration information from the database
     * @param idConfig id of the configuration to get information
     * @returns CalibrationQueryAnswer object with the information of the calibration (see CalibrationQueryAnswer for more information)
     */
    async getCalibrationInfo(idConfig) {
        const calibrationData = await this.queryData("SELECT * FROM Configurations WHERE idConfig = ? ;", [idConfig]);
        if (calibrationData.length == 0) {
            throw new Error("La configuration de calibration n'existe pas.");
        }
        return calibrationData[0];
    }
    /**
     * Get the settings information from the database
     * @returns SettingsQueryAnswer object with the information of the settings (see SettingsQueryAnswer for more information)
     */
    async getSettings() {
        const settingsData = await this.queryData("SELECT * FROM Settings;");
        if (settingsData.length == 0) {
            throw new Error("Les paramètres n'existent pas.");
        }
        return settingsData[0];
    }
    /**
     * Remove all the campaigns that are finished and older than the removeInterval
     * @param removeInterval The interval in seconds to remove the campaigns
     */
    async removeOldCampaigns(removeInterval) {
        const campainsToRemove = await exports.sqlConnections.queryData("SELECT * FROM Campaigns WHERE TIMESTAMPDIFF(SECOND,endingDate, NOW()) > ? ;", [removeInterval]);
        campainsToRemove.forEach(async (campaign) => {
            await RunCampaign_1.campaignRunner.stopCampaign(campaign.idCampaign);
            await exports.sqlConnections.queryData("DELETE FROM Logs WHERE idCampaign = ?;", [campaign.idCampaign]);
            await exports.sqlConnections.queryData("DELETE FROM Measurements WHERE idCampaign = ?; ", [campaign.idCampaign]);
            await exports.sqlConnections.queryData("DELETE FROM Campaigns WHERE idCampaign = ?; ", [campaign.idCampaign]);
        });
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
