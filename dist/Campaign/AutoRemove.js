"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initAutoRemove = void 0;
const DatabaseManager_1 = require("../Database/DatabaseManager");
const worker_1 = require("threads/worker");
class AutoRemove {
    async remove() {
        while (true) {
            let settings = await DatabaseManager_1.sqlConnections.queryData("select * from Settings;");
            if (settings[0].autoRemove == 1) {
                await DatabaseManager_1.sqlConnections.queryData("DELETE FROM Logs where idCampaign in (Select idCampaign FROM Campaigns where TIMESTAMPDIFF(SECOND,endingDate, NOW()) > ? ); ", [settings[0].removeInterval]);
                await DatabaseManager_1.sqlConnections.queryData("DELETE FROM Measurements where idCampaign in (Select idCampaign FROM Campaigns where TIMESTAMPDIFF(SECOND,endingDate, NOW()) > ? ); ", [settings[0].removeInterval]);
                await DatabaseManager_1.sqlConnections.queryData("DELETE FROM Campaigns where TIMESTAMPDIFF(SECOND,endingDate, NOW()) > ? ; ", [settings[0].removeInterval]);
            }
            await new Promise(f => setTimeout(f, 60000));
        }
        ;
    }
}
exports.default = AutoRemove;
function initAutoRemove() {
    let autoRemove = new AutoRemove();
    autoRemove.remove();
}
exports.initAutoRemove = initAutoRemove;
(0, worker_1.expose)(initAutoRemove);
