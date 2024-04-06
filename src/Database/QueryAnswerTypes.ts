/**
 * Represents campaign informations stored to the database.
 */
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

/**
 * Represents the currently stored setting in the database.
 * These settings are used to configure the measure device behavior.
 */
export type SettingsQueryAnswer = {
    /**
     * The interval (in seconds) where we remove campaigns.
     */
    removeInterval: number | null,

    /**
     * If the auto remove process is enabled.
     */
    autoRemove: boolean | null, 
}

/**
 * Represents the calibration informations stored to the database.
 */
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