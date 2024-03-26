import * as net from "net";
import { logger } from "../Logger/LoggerManager";
import { config } from "dotenv";
import { EventEmitter } from "events";
import { TcpDaemonRequest, TcpDaemonAnswer } from "./TcpDaemonMessageTypes";

export default class TcpManager{
    private answerListeners: Map<string, EventEmitter>;
    private client = new net.Socket();
    private timeout: number = 10000;

    constructor() {
        this.answerListeners = new Map<string, EventEmitter>();
    }

    startconnection(){
        // Chargement des variables d'environnement
        config();

        const port: number = +(process?.env?.DAEMON_PORT ?? 12778);
        const host: string = process?.env?.DAEMON_HOST ?? 'localhost';
        this.timeout = +(process?.env?.DAEMON_TIMEOUT ?? 10000);

        this.client.connect(port, host, function() {
            logger.info('Connxion TCP établi.');
        });
        this.client.on('data', (message:string) => {
            let answer = new TcpDaemonAnswer(message); 
            this.answerListeners.get(answer.id)?.emit("response", answer);
        });
    }

    async getMeasure() {
        return this.sendCommand('GET_MEASURE');
    }

    async closeConnection() {
        return this.sendCommand('CLOSE');
    }
    
    async resetModule() {
        return this.client.write('RESET');
    }

    async calibrateModule(calibration:number[]) {
        return this.client.write('SET_CONFIG');
    }

    async getErrors() {
        return this.client.write('GET_ERRORS');
    }

    async sendCommand(query: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let request = new TcpDaemonRequest(query);
            let answerListener = new EventEmitter();
            this.answerListeners.set(request.id, answerListener);
            this.client.write(request.toString());

            // Set a timeout for 10 seconds
            const timeoutCallback = setTimeout(() => {
                const errorMessage = "Timeout: No response received within 10 seconds";
                this.answerListeners.delete(request.id);
                reject(new Error(errorMessage));
            }, this.timeout);

            answerListener.on("response", (answer: TcpDaemonAnswer) => {
                clearTimeout(timeoutCallback); // Clear the timeout if a response is received
                if (!answer.error) {
                    this.answerListeners.delete(answer.id);
                    resolve(answer.response);
                } else {
                    reject(new Error(answer.response));
                }
            });
        });
    }
}
export function initTcpConnection(){
    let tcpConnection = new TcpManager();
    tcpConnection.startconnection();
}
export declare var tcpConnection: TcpManager;
