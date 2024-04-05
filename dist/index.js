"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebAPI_1 = require("./WEB_API/WebAPI");
const DatabaseManager_1 = require("./Database/DatabaseManager");
const LoggerManager_1 = require("./Logger/LoggerManager");
const TcpManager_1 = require("./Tcp/TcpManager");
const autoRemove_1 = require("./Campaign/autoRemove");
const RunCampaign_1 = require("./Campaign/RunCampaign");
//sleep(10000); // Sleep 10s au redémarrage rasp pi.
(0, LoggerManager_1.initLogger)(); // initialise le logger
(0, DatabaseManager_1.initSqlConnections)(); // initialise les connexions à la base de données
(0, RunCampaign_1.initCampaignRunner)(); // initialise le runner de campagne (loop)
(0, WebAPI_1.startAPI)(); // démarre l'API WEB
(0, autoRemove_1.startAutoRemoveLoop)(); // start the auto remove thread
(0, TcpManager_1.initTcpConnection)(); // start the TCP connection with the driver in charge of the sensors
process.on('unhandledRejection', reason => {
    LoggerManager_1.logger.error('Main Unhandled Rejection :', reason);
});
process.on("uncaughtException", err => {
    LoggerManager_1.logger.error('Main Uncaught Exception :', err);
});
