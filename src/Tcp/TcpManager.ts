import * as net from "net";
import { logger } from "../Logger/LoggerManager";

export default class TcpManager{
    private client = new net.Socket();

    startconnection(){
        this.client.connect(12778, '127.0.0.1', function() {
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
