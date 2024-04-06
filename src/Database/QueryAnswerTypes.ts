export type CampaignQueryAnswer = {
    idCampaign: number,
    idConfig: number | null,
    name: string,
    beginDate: Date,
    temperatureSensorState: boolean,
    CO2SensorState: boolean,
    O2SensorState: boolean,
    luminositySensorState: boolean,
    humiditySensorState: boolean,
    interval_: number,
    volume: number | null,
    duration: number,
    humidMode: boolean,
    enableFiboxTemp: boolean,
    finished: boolean,
    alertLevel: number,
    endingDate: Date | null 
}

export type SettingsQueryAnswer = {
    removeInterval: number | null,
    autoRemove: boolean | null, 
}

export type CalibrationQueryAnswer = {
    idConfig: number,
    name: string,
    altitude: number,
    f1: number,
    m: number,
    dPhi1: number,
    dPhi2: number,
    dKSV1: number,
    dKSV2: number,
    pressure: number,
    calibIsHumid: boolean,
    cal0: number,
    cal2nd: number,
    o2cal2nd: number,
    t0: number,
    t2nd: number
}