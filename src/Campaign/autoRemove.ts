import { sqlConnections } from "../Database/DatabaseManager";
import { logger } from "../Logger/LoggerManager";
import { sleep } from "../Helper/sleep";

export async function startAutoRemoveLoop() {
    logger.info("Auto remove process loop started");
    while (true){
        try {
            let settings = await sqlConnections.queryData("select * from Settings;");

            if(settings[0].autoRemove == 1){
                await sqlConnections.queryData("DELETE FROM Logs where idCampaign in (Select idCampaign FROM Campaigns where TIMESTAMPDIFF(SECOND,endingDate, NOW()) > ? ); ",[settings[0].removeInterval]);
                await sqlConnections.queryData("DELETE FROM Measurements where idCampaign in (Select idCampaign FROM Campaigns where TIMESTAMPDIFF(SECOND,endingDate, NOW()) > ? ); ",[settings[0].removeInterval]);
                await sqlConnections.queryData("DELETE FROM Campaigns where TIMESTAMPDIFF(SECOND,endingDate, NOW()) > ? ; ",[settings[0].removeInterval]);
            }
        } catch (error) {
            logger.error("Exception in the auto remove process loop: " + error);
        }
    
        await sleep(60000);
    };
}