import { loadConfig } from "../Helper/loadConfig";
import mysql, { Pool } from "mysql2";
import { logger } from "../Logger/LoggerManager";
import { TcpDaemonMeasurement } from "../Tcp/TcpCommandAnswerTypes";
import { SensorStates } from "../Campaign/SensorStatesType";
import { CampaignQueryAnswer, CalibrationQueryAnswer, SettingsQueryAnswer } from "./QueryAnswerTypes";
import { CampaignStateLevelCode, LogLevelCode } from "./LevelCode";

/**
 * Class to manage the connection to the database.
 */
export default class Database {
    private connection: Pool | null;

    constructor() {
        this.connection = null;
    }

    open() {
        logger.info("Ouverture d'une nouvelle connexion à la base de données.");

        // Chargement des variables d'environnement
        loadConfig();

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
        
        this.connection = mysql.createPool({
            host: process?.env?.DATABASE_HOST,
            user: process?.env?.DATABASE_USER_NAME,
            database: process?.env?.DATABASE_NAME,
            password: process?.env?.DATABASE_PASSWORD,
            waitForConnections: true,
            multipleStatements: false,
            connectionLimit: 10
        })
        
        logger.info("Ouverture terminé.");
    }

    close() {
        logger.info("Fermeture de la connexion à la base de données.");

        if (this.connection){
            this.connection.end();
            this.connection = null;
        }

        logger.info("Connexion fermé.");
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
    private queryData(sql: string, params?: (number | string | Date)[]): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!this.connection) {
                return reject(new Error("connection n'est pas défini."));
            }

            this.connection.query(sql, params || [], (error, results) => {
                if (error) {
                    return reject(new Error("Oups ! La requête avec la base de données à échouée : " + error + "\nSQL demandé: " + sql + "\nParam: " + params));
                }

                return resolve((results as object[]) || []);
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
    async insertLogs(idCampaign:number,state:LogLevelCode,title:string,msg:string, date: Date = new Date()) {
        let query:string = "insert into Logs values(?,?, ?,? ,?);";
        try {
            await this.queryData(query,[idCampaign,state,title,msg,date]);
        } catch (error) {
            logger.error("Erreur lors de l'insertion des logs dans la base de données : " + error);
        }
    }

    /**
     * Update the campaign state in the database
     * @param idCampaign The id of the campaign to update
     * @param alertLevel The new state level of the campaign (see CampaignStateLevelCode for more information)
     */
    async setAlertLevel(idCampaign:number, alertLevel:CampaignStateLevelCode){
        let query="update Campaigns set alertLevel=? where idCampaign=?;";
        try {
            await this.queryData(query, [alertLevel,idCampaign]);
        } catch (error) {
            logger.error("Erreur lors de la mise à jour de la campagne dans la base de données : " + error);
        }
    }

    /**
     * Update the campaign finised state in the database.
     * It will also update the ending or begining date in the corresponding case.
     * @param idCampaign The id of the campaign to update
     * @param finished True if the campaign is finished, else false
     */
    async setFinished(idCampaign:number, finished:boolean) {
        let updateDateQuery: string;
        if (finished) {
            updateDateQuery = ", endingDate=NOW()";
        } else {
            updateDateQuery = ", beginDate=NOW()";
        }

        let query="UPDATE Campaigns SET finished=?" + updateDateQuery + " WHERE idCampaign=?;";
        try {
            await this.queryData(query, [+finished, idCampaign]);
        } catch (error) {
            logger.error("Erreur lors de la mise à jour de la campagne dans la base de données : " + error);
        }
    }

    /**
     * Insert a new measure in the database
     * @param idCampaign The id of the campaign where the measure need to be inserted
     * @param sensorData The data to insert in the database (see TcpDaemonMeasurement for more information)
     * @param sensorStates The state of the sensors (see SensorStates for more information)
     */
    async insertMeasure(idCampaign:number, sensorData: TcpDaemonMeasurement, sensorStates: SensorStates) {
        let values:string="";
        if(sensorStates.temperature){
            values+=sensorData.temperature+",";
        }else{
            values+="NULL,";
        }
        if(sensorStates.co2){
            values+=sensorData.CO2+",";
        }else{
            values+="NULL,"
        }
        if(sensorStates.o2){
            values+=sensorData.O2+",";
        }else{
            values+="NULL,"
        }

        if(sensorStates.humidity){
            values+=sensorData.humidity+",";
        }else{
            values+="NULL,"
        }
            
        if(sensorStates.luminosity){
            values+=sensorData.luminosity;
        }else{
            values+="NULL"
        }
        let query="INSERT INTO Measurements values(?,"+values+",NOW());"
        await this.queryData(query, [idCampaign]);
    }

    /**
     * Get the information of a campaign from the database
     * @param idCampaign id of the campaign to get information
     * @returns CampaignQueryAnswer object with the information of the campaign (see CampaignQueryAnswer for more information)
     */
    async getCampaignInfo(idCampaign:number): Promise<CampaignQueryAnswer> {
        const campaignsData = await sqlConnections.queryData("SELECT * FROM Campaigns WHERE idCampaign = ? ;", [idCampaign]);
        if(campaignsData.length == 0){
            throw new Error("La campagne n'existe pas.");
        }

        return campaignsData[0];
    }

    /**
     * Get all the campaigns that are currently running
     * @returns An array of CampaignQueryAnswer with the information of the campaigns (see CampaignQueryAnswer for more information)
     */
    async getRunningCampaigns(): Promise<CampaignQueryAnswer[]> {
        return await this.queryData("SELECT * FROM Campaigns WHERE finished = 0;");
    }

    /**
     * Get the calibration information from the database
     * @param idConfig id of the configuration to get information
     * @returns CalibrationQueryAnswer object with the information of the calibration (see CalibrationQueryAnswer for more information)
     */
    async getCalibrationInfo(idConfig:number): Promise<CalibrationQueryAnswer> {
        const calibrationData = await this.queryData("SELECT * FROM Configurations WHERE idConfig = ? ;", [idConfig]);
        if(calibrationData.length == 0){
            throw new Error("La configuration de calibration n'existe pas.");
        }

        return calibrationData[0];
    }

    /**
     * Get the settings information from the database
     * @returns SettingsQueryAnswer object with the information of the settings (see SettingsQueryAnswer for more information)
     */
    async getSettings(): Promise<SettingsQueryAnswer> {
        const settingsData = await this.queryData("SELECT * FROM Settings;");
        if(settingsData.length == 0){
            throw new Error("Les paramètres n'existent pas.");
        }

        return settingsData[0];
    }

    /**
     * Remove all the campaigns that are finished and older than the removeInterval
     * @param removeInterval The interval in seconds to remove the campaigns
     */
    async removeOldCampaigns(removeInterval:number) {
        await sqlConnections.queryData("DELETE FROM Logs where idCampaign in (Select idCampaign FROM Campaigns where TIMESTAMPDIFF(SECOND,endingDate, NOW()) > ? ); ",[removeInterval]);
        await sqlConnections.queryData("DELETE FROM Measurements where idCampaign in (Select idCampaign FROM Campaigns where TIMESTAMPDIFF(SECOND,endingDate, NOW()) > ? ); ",[removeInterval]);
        await sqlConnections.queryData("DELETE FROM Campaigns where TIMESTAMPDIFF(SECOND,endingDate, NOW()) > ? ; ",[removeInterval]);
    }
}

/**
 * Global variable to access the database connection
 */
export declare var sqlConnections: Database;

export function initSqlConnections() {
    sqlConnections = new Database();

    try {
        sqlConnections.open();
    } catch (error) {
        logger.error("Failed to open database: " + error)
    }
    
}