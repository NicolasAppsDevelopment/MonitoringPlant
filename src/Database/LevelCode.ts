/**
 * Represents the level of a log.
 */
export enum LogLevelCode {
    /**
     * Indicate a processing operation
     */
    PROCESSING = 0,

    /**
     * Indicate a successfull operation leading to the end of the campaign
     */
    SUCCESS = 1,

    /**
     * Indicate a critical error leading to the stop of the campaign
     */
    ERROR = 2,

    /**
     * Indicate a warning
     */
    WARNING = 3
}

/**
 * Represents the state level of a campaign.
 */
export enum CampaignStateLevelCode {

    /**
     * Success if the campaign is finished without any error
     */
    SUCCESS = 0,

    /**
     * Warning if the campaign is finished (or still running) with some errors
     */
    WARNING = 1,

    /**
     * Error if the campaign has been stopped by a critical error
     */
    ERROR = 2
}