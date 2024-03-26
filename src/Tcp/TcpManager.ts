import * as net from "net";
import { logger } from "../Logger/LoggerManager";
import { config } from "dotenv";

export default class TcpManager{
    private client = new net.Socket();

    startconnection(){
        // Chargement des variables d'environnement
        config();

        const port: string = process?.env?.DAEMON_PORT || '12778';
        const host: string = process?.env?.DAEMON_HOST || 'localhost';

        this.client.connect(+port, host, function() {
            logger.info('Connxion TCP établi.');
        });
        this.client.on('data', (data:any) => {
            
            

          });
    }

    sendCommandMeasure() : string {
        this.client.write('GET_MEASURE');
        return "";
    }

    sendCommandClose() : string {
        this.client.write('CLOSE');
        return "";
    }
    sendCommandReset() : string {
        this.client.write('RESET');
        return "";
    }
    sendCommandCalibrate(calibration:number[]) : string {
        //créer JSON

        this.client.write('SET_CONFIG');
        return "";
    }

    sendCommandError() : string {
        this.client.write('GET_ERRORS');
        return "";
    }
}
export function initTcpConnection(){
    let tcpConnection = new TcpManager();
    tcpConnection.startconnection();
}
export declare var tcpConnection: TcpManager;
