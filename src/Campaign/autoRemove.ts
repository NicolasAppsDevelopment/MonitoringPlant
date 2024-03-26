import { sqlConnections} from "../Database/DatabaseManager";
import { Worker } from 'worker_threads';
class autoRemove{
    
    async remove(){
        while (true){
            let settings = await sqlConnections.queryData("select * from Settings;");
            if(settings[0].autoRemove == 1){
                "DELETE FROM Logs where idCampaign in (Select idCampaign FROM Campaigns where TIMESTAMPDIFF(SECOND,endingDate, NOW()) > ? ); ";
                await sqlConnections.queryData("DELETE FROM Logs where idCampaign in (Select idCampaign FROM Campaigns where TIMESTAMPDIFF(SECOND,endingDate, NOW()) > ? ); ",[settings[0].removeInterval]);
                await sqlConnections.queryData("DELETE FROM Measurements where idCampaign in (Select idCampaign FROM Campaigns where TIMESTAMPDIFF(SECOND,endingDate, NOW()) > ? ); ",[settings[0].removeInterval]);
                await sqlConnections.queryData("DELETE FROM Campaigns where TIMESTAMPDIFF(SECOND,endingDate, NOW()) > ? ; ",[settings[0].removeInterval]);
            }
            await new Promise(f => setTimeout(f, 60000));
        
        
        };
    }
    
}