export class TcpDaemonGetError {
    date: Date;
    message: string;
    
    constructor(date: string, message: string) {
        this.date = new Date(date);
        this.message = message;
    }
}

export class TcpDaemonMeasurement {
    temperature: number;
    luminosity: number;
    humidity: number;
    pressure: number;
    CO2: number;
    O2: number;

    constructor(temperature: number, luminosity: number, humidity: number, pressure: number, CO2: number, O2: number) {
        this.temperature = temperature;
        this.luminosity = luminosity;
        this.humidity = humidity;
        this.pressure = pressure;
        this.CO2 = CO2;
        this.O2 = O2;
    }
}