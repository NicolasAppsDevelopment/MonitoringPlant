import { nanoid } from 'nanoid';

export class TcpDaemonAnswerError extends Error {
    code: number;
    
    constructor(code: number, message: string) {
        super(message);
        this.code = code;
    }
}


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