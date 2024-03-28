import { loadConfig } from "../Helper/loadConfig";
import mysql, { Pool } from "mysql2";
import { logger } from "../Logger/LoggerManager";

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

    queryData(sql: string, params?: (number | string | Date)[]): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!this.connection) {
                return reject("connection n'est pas défini.");
            }

            this.connection.query(sql, params || [], (error, results) => {
                if (error) {
                    return reject("Oups ! La requête avec la base de données à échouée : " + error + "\nSQL demandé: " + sql + "\nParam: " + params);
                }

                return resolve((results as object[]) || []);
            });
        });
    }

    async insertLogs(idCampaign:number,state:number,title:string,msg:string) {
        let now:Date = new Date();
        let query:string = "insert into Logs values(?,?, ?,? ,?);";
        try {
            await this.queryData(query,[idCampaign,state,title,msg,now]);
        } catch (error) {
            logger.error("Erreur lors de l'insertion des logs dans la base de données : " + error);
        }
    }

    async setAlertLevel(idCampaign:number, alertLevel:number){
        let query="update Campaigns set alertLevel= ? where idCampaign=?;";
        try {
            await this.queryData(query, [alertLevel,idCampaign]);
        } catch (error) {
            logger.error("Erreur lors de la mise à jour de la campagne dans la base de données : " + error);
        }
    }

    async setFinished(idCampaign:number){
        let now:Date=new Date();
        let query="update Campaigns set finished=1,endingDate= ? where idCampaign=?;";
        try {
            await this.queryData(query, [now,idCampaign]);
        } catch (error) {
            logger.error("Erreur lors de la mise à jour de la campagne dans la base de données : " + error);
        }
    }



}

// gloabal declaration
export declare var sqlConnections: Database;

export function initSqlConnections() {
    sqlConnections = new Database();

    try {
        sqlConnections.open();
    } catch (error) {
        logger.error("Failed to open database: " + error)
    }
    
}




