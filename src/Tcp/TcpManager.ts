import * as net from "net";
import { logger } from "../Logger/LoggerManager";
import { loadConfig } from "../Helper/loadConfig";
import { EventEmitter } from "events";
import { TcpDaemonRequest, TcpDaemonAnswer } from "./TcpDaemonMessageTypes";
import Calibration from "../Campaign/Calibration";
import { TcpDaemonGetError, TcpDaemonMeasurement } from "./TcpCommandAnswerTypes";

export default class TcpManager{
    private answerListeners: Map<string, EventEmitter>;
    private client = new net.Socket();
    private timeout: number = 10000;

    constructor() {
        this.answerListeners = new Map<string, EventEmitter>();
    }

    startconnection(){
        // Chargement des variables d'environnement
        loadConfig();

        const port: string | undefined = process?.env?.DAEMON_PORT;
        if (!port) {
            throw new Error("Le port du démon n'est pas défini dans le fichier .env");
        }

        const host: string | undefined = process?.env?.DAEMON_HOST;
        if (!host) {
            throw new Error("L'hôte du démon n'est pas défini dans le fichier .env");
        }

        const timeout: string | undefined = process?.env?.ANSWER_TIMEOUT;
        if (!timeout) {
            throw new Error("Le timeout des requêtes du démon n'est pas défini dans le fichier .env");
        }
        this.timeout = +timeout;

        this.client.connect(+port, host, function() {
            logger.info('Connxion TCP établi.');
        });
        this.client.on('data', (message:string) => {
            console.log("raw: " + message);
            let answer = new TcpDaemonAnswer(message);
            this.answerListeners.get(answer.id)?.emit("response", answer);
        });
    }

    async getMeasure(): Promise<TcpDaemonMeasurement> {
        return await this.sendCommand('GET_MEASURE');
    }

    async closeConnection() {
        return await this.sendCommand('CLOSE');
    }
    
    async resetModule() {
        return await this.sendCommand('RESET');
    }

    async calibrateModule(calibration: Calibration) {
        return await this.sendCommand('SET_CONFIG' + calibration.buildTCPCommandArgs());
    }

    async getErrors(): Promise<TcpDaemonGetError[]> {
        return await this.sendCommand('GET_ERRORS');
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
                if (!answer.success) {
                    this.answerListeners.delete(answer.id);
                    resolve(answer.response);
                } else {
                    reject(answer.error!);
                }
            });
        });
    }
}
export function initTcpConnection(){
    tcpConnection = new TcpManager();
    tcpConnection.startconnection();
}
export declare var tcpConnection: TcpManager;
