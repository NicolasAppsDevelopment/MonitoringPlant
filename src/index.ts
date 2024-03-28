import { startAPI } from "./WEB_API/WebAPI";
import { initSqlConnections } from "./Database/DatabaseManager";
import { initLogger, logger } from "./Logger/LoggerManager";
import { initTcpConnection} from "./Tcp/TcpManager";
import { startAutoRemoveLoop } from "./Campaign/autoRemove";
import { initCampaignRunner } from "./Campaign/RunCampaign";
import { sleep } from "./Helper/sleep";

//sleep(10000); // Sleep 10s au redémarrage rasp pi.
initLogger(); // initialise le logger
initSqlConnections(); // initialise les connexions à la base de données
initCampaignRunner(); // initialise le runner de campagne (loop)
startAPI(); // démarre l'API WEB
startAutoRemoveLoop(); // start the auto remove thread
initTcpConnection(); // start the TCP connection with the driver in charge of the sensors


process.on('unhandledRejection', reason => {
    logger.error('Main Unhandled Rejection :', reason);
});
process.on("uncaughtException", err => {
    logger.error('Main Uncaught Exception :', err);
});
