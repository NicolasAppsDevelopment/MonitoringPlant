import { startAPI } from "./WEB_API/WebAPI";
import { initSqlConnections } from "./Database/DatabaseManager";
import { initLogger, logger } from "./Logger/LoggerManager";
import { initTcpConnection } from "./Tcp/TcpManager";
import { startAutoRemoveLoop } from "./Campaign/autoRemove";
import { initCampaignRunner } from "./Campaign/RunCampaign";

initLogger();
initSqlConnections();
initCampaignRunner();
startAPI();
startAutoRemoveLoop();
initTcpConnection();

process.on('unhandledRejection', reason => {
    logger.error('Main Unhandled Rejection :', reason);
});
process.on("uncaughtException", err => {
    logger.error('Main Uncaught Exception :', err);
});
