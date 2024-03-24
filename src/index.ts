import { startAPI } from "./WEB_API/WebAPI";
import { initSqlConnections } from "./Database/DatabaseManager";
import { initLogger, logger } from "./Logger/LoggerManager";

initLogger(); // initialise le logger
initSqlConnections(); // initialise les connexions à la base de données
startAPI(); // démarre l'API WEB

process.on('unhandledRejection', reason => {
    logger.error('Main Unhandled Rejection :', reason);
});
process.on("uncaughtException", err => {
    logger.error('Main Uncaught Exception :', err);
});