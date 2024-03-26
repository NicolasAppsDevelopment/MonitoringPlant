"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebAPI_1 = require("./WEB_API/WebAPI");
const DatabaseManager_1 = require("./Database/DatabaseManager");
const LoggerManager_1 = require("./Logger/LoggerManager");
//Sleep 10s au redémarrage rasp pi.
(0, LoggerManager_1.initLogger)(); // initialise le logger
(0, DatabaseManager_1.initSqlConnections)(); // initialise les connexions à la base de données
(0, WebAPI_1.startAPI)(); // démarre l'API WEB
//initTcpConnection(); // start the TCP connection with the driver in charge of the sensors
process.on('unhandledRejection', reason => {
    LoggerManager_1.logger.error('Main Unhandled Rejection :', reason);
});
process.on("uncaughtException", err => {
    LoggerManager_1.logger.error('Main Uncaught Exception :', err);
});
// while (true){
//     async () => { 
//         let settings = await sqlConnections.queryData("select * from Settings;");
//         if(settings[0].autoRemove == 1){
//             "DELETE FROM Logs where idCampaign in (Select idCampaign FROM Campaigns where TIMESTAMPDIFF(SECOND,endingDate, NOW()) > ? ); ";
//             await sqlConnections.queryData("DELETE FROM Logs where idCampaign in (Select idCampaign FROM Campaigns where TIMESTAMPDIFF(SECOND,endingDate, NOW()) > ? ); ",[settings[0].removeInterval]);
//             await sqlConnections.queryData("DELETE FROM Measurements where idCampaign in (Select idCampaign FROM Campaigns where TIMESTAMPDIFF(SECOND,endingDate, NOW()) > ? ); ",[settings[0].removeInterval]);
//             await sqlConnections.queryData("DELETE FROM Campaigns where TIMESTAMPDIFF(SECOND,endingDate, NOW()) > ? ; ",[settings[0].removeInterval]);
//         }
//         await new Promise(f => setTimeout(f, 60000));
//     };
// }
