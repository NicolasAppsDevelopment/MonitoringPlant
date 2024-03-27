import { loadConfig } from "../Helper/loadConfig";
import mysql, { Pool } from "mysql2";
import { logger } from "../Logger/LoggerManager";

export default class Database {
    private connection: Pool | null;

    constructor() {
        this.connection = null;
    }

    open(): Database {
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
        
        if (this.connection !== null) return this;
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

        return this;
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

    insertLogs(idCampaign:number,state:number,title:string,msg:string) {
        let now:Date = new Date();
        let query:string = "insert into Logs values( ?,?, ?,? ,?);";
        this.queryData(query,[idCampaign,state,title,msg,now]);
    }

    setAlertLevel(idCampaign:number){

    }

    setFinished(idCampaign:number){
        let now:Date=new Date();
        let query="update Campaigns set finished=1,endingDate= ? where idCampaign= ? ";
        this.queryData(query)
    }



}

// gloabal declaration for main process ONLY !
export declare var sqlConnections: Database;

export function initSqlConnections() {
    sqlConnections = new Database();
    sqlConnections.open();
}




