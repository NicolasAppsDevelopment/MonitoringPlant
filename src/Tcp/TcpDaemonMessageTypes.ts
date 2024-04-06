import { nanoid } from 'nanoid';

/**
 * Error class for TcpDaemonAnswer
 */
export class TcpDaemonAnswerError extends Error {
    code: number;
    
    constructor(code: number, message: string) {
        super(message);
        this.code = code;
    }
}

/**
 * Represents the answer of the TCP daemon to a command.
 */
export class TcpDaemonAnswer {
    response: any;
    id: string;
    success: boolean;
    error: TcpDaemonAnswerError | null;

    constructor(message: string) {
        let answer = JSON.parse(message);
        this.id = answer.id;
        this.success = answer.success;
        if (!this.success) {
            this.error = new TcpDaemonAnswerError(answer.error.code, answer.error.message);
            this.response = null;
        } else {
            this.response = answer.data;
            this.error = null;
        }
    }
}

/**
 * Represents the request to send to the TCP daemon.
 */
export class TcpDaemonRequest {
    query: any;
    id: string;
    
    constructor(query: string) {
        this.id = nanoid();
        this.query = query;
    }

    toString() {
        return this.id + " " + this.query;
    }
}