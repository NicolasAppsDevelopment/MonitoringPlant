"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebAPI_1 = require("./WEB_API/WebAPI");
const DatabaseManager_1 = require("./Database/DatabaseManager");
const LoggerManager_1 = require("./Logger/LoggerManager");
(0, LoggerManager_1.initLogger)(); // initialise le logger
(0, DatabaseManager_1.initSqlConnections)(); // initialise les connexions à la base de données
(0, WebAPI_1.startAPI)(); // démarre l'API WEB
process.on('unhandledRejection', reason => {
    LoggerManager_1.logger.error('Main Unhandled Rejection :', reason);
});
process.on("uncaughtException", err => {
    LoggerManager_1.logger.error('Main Uncaught Exception :', err);
});
