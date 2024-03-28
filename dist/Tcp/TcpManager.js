"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initTcpConnection = void 0;
const net = __importStar(require("net"));
const LoggerManager_1 = require("../Logger/LoggerManager");
const dotenv_1 = require("dotenv");
const events_1 = require("events");
const TcpDaemonMessageTypes_1 = require("./TcpDaemonMessageTypes");
class TcpManager {
    answerListeners;
    client = new net.Socket();
    timeout = 10000;
    constructor() {
        this.answerListeners = new Map();
    }
    startconnection() {
        // Chargement des variables d'environnement
        (0, dotenv_1.config)();
        const port = +(process?.env?.DAEMON_PORT ?? 12778);
        const host = process?.env?.DAEMON_HOST ?? 'localhost';
        this.timeout = +(process?.env?.DAEMON_TIMEOUT ?? 10000);
        this.client.connect(port, host, function () {
            LoggerManager_1.logger.info('Connxion TCP établi.');
        });
        this.client.on('data', (message) => {
            let answer = new TcpDaemonMessageTypes_1.TcpDaemonAnswer(message);
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
    async calibrateModule(calibration) {
        return this.client.write('SET_CONFIG');
    }
    async getErrors() {
        return this.client.write('GET_ERRORS');
    }
    async sendCommand(query) {
        return new Promise((resolve, reject) => {
            let request = new TcpDaemonMessageTypes_1.TcpDaemonRequest(query);
            let answerListener = new events_1.EventEmitter();
            this.answerListeners.set(request.id, answerListener);
            this.client.write(request.toString());
            // Set a timeout for 10 seconds
            const timeoutCallback = setTimeout(() => {
                const errorMessage = "Timeout: No response received within 10 seconds";
                this.answerListeners.delete(request.id);
                reject(new Error(errorMessage));
            }, this.timeout);
            answerListener.on("response", (answer) => {
                clearTimeout(timeoutCallback); // Clear the timeout if a response is received
                if (!answer.error) {
                    this.answerListeners.delete(answer.id);
                    resolve(answer.response);
                }
                else {
                    reject(new Error(answer.response));
                }
            });
        });
    }
}
exports.default = TcpManager;
function initTcpConnection() {
    let tcpConnection = new TcpManager();
    tcpConnection.startconnection();
}
exports.initTcpConnection = initTcpConnection;
