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
    }

    writeCommandMeasure(){
        this.client.write('GET_MEASURE');
    }

    writeCommandClose(){
        this.client.write('CLOSE');
    }
    writeCommandReset(){
        this.client.write('RESET');
    }
    writeCommandCalibrate(calibration:number[]){
        //créer JSON

        this.client.write('SET_CONFIG');
    }

    writeCommandError(){
        this.client.write('GET_ERRORS');
    }



    readData(){
        this.client.on('data', (data:any) => {
            console.log(data.toString());
          });
    }

}
export function initTcpConnection(){
    let tcpConnection = new TcpManager();
    tcpConnection.startconnection();
}
export declare var tcpConnection: TcpManager;
