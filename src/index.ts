import { startAPI } from "./WEB_API/WebAPI";
import { initSqlConnections } from "./Database/DatabaseManager";
import { initLogger, logger } from "./Logger/LoggerManager";
import { initTcpConnection} from "./Tcp/TcpManager";
import { startAutoRemoveLoop } from "./Campaign/autoRemove";

//Sleep 10s au redémarrage rasp pi.
initLogger(); // initialise le logger
initSqlConnections(); // initialise les connexions à la base de données
startAPI(); // démarre l'API WEB
startAutoRemoveLoop(); // start the auto remove thread
initTcpConnection(); // start the TCP connection with the driver in charge of the sensors



process.on('unhandledRejection', reason => {
    logger.error('Main Unhandled Rejection :', reason);
});
process.on("uncaughtException", err => {
    logger.error('Main Uncaught Exception :', err);
});
