import { nanoid } from 'nanoid';

export class TcpDaemonAnswer {
    response: any;
    id: string;
    error: boolean;
    
    constructor(message: string) {
        let answer = JSON.parse(message);
        this.id = answer.id;
        this.response = answer.data;
        this.error = answer.success;
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