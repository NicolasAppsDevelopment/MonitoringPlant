import { config } from "dotenv";
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
        config();
        
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

    insertLogs(idCampaign:number,title:string,msg:string) {
        let now:Date = new Date();
        let query:string = "insert into Logs values( ?, ?,? ,?);";
        this.queryData(query,[idCampaign,title,msg,now]);
    }

    setAlertLevel(idCampaign:number){

    }

    setFinished(idCampaign:number){
        let now:Date=new Date();
        let query="update Campaigns set finished=1,endingDate= ? where idCampaign= ? ";
        this.queryData(query)
        //NOW() "+global.get("currentCampagne");
    }



}

// gloabal declaration for main process ONLY !
export declare var sqlConnections: Database;

export function initSqlConnections() {
    sqlConnections = new Database();
    sqlConnections.open();
}




