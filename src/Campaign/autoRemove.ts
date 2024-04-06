import { sqlConnections } from "../Database/DatabaseManager";
import { logger } from "../Logger/LoggerManager";
import { sleep } from "../Helper/sleep";

/**
 * Check every minute if a campaign need to be removed.
 * According settings it will remove them.
 */
export async function startAutoRemoveLoop() {
    logger.info("Auto remove process loop started");
    while (true){
        try {
            let settings = await sqlConnections.getSettings();

            if(settings.autoRemove){
                await sqlConnections.removeOldCampaigns(settings.removeInterval!);
            }
        } catch (error) {
            logger.error("Exception in the auto remove process loop: " + error);
        }
    
        await sleep(60000);
    };
}