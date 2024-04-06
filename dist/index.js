"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebAPI_1 = require("./WEB_API/WebAPI");
const DatabaseManager_1 = require("./Database/DatabaseManager");
const LoggerManager_1 = require("./Logger/LoggerManager");
const TcpManager_1 = require("./Tcp/TcpManager");
const autoRemove_1 = require("./Campaign/autoRemove");
const RunCampaign_1 = require("./Campaign/RunCampaign");
(0, LoggerManager_1.initLogger)();
(0, DatabaseManager_1.initSqlConnections)();
(0, RunCampaign_1.initCampaignRunner)();
(0, WebAPI_1.startAPI)();
(0, autoRemove_1.startAutoRemoveLoop)();
(0, TcpManager_1.initTcpConnection)();
process.on('unhandledRejection', reason => {
    LoggerManager_1.logger.error('Main Unhandled Rejection :', reason);
});
process.on("uncaughtException", err => {
    LoggerManager_1.logger.error('Main Uncaught Exception :', err);
});
