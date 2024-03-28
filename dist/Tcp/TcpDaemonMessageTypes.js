"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TcpDaemonRequest = exports.TcpDaemonAnswer = void 0;
const nanoid_1 = require("nanoid");
class TcpDaemonAnswer {
    response;
    id;
    error;
    constructor(message) {
        let answer = JSON.parse(message);
        this.id = answer.id;
        this.response = answer.data;
        this.error = answer.success;
    }
}
exports.TcpDaemonAnswer = TcpDaemonAnswer;
class TcpDaemonRequest {
    query;
    id;
    constructor(query) {
        this.id = (0, nanoid_1.nanoid)();
        this.query = query;
    }
    toString() {
        return this.id + " " + this.query;
    }
}
exports.TcpDaemonRequest = TcpDaemonRequest;
