/**
 * Transforms a Javascript Date into a string with the format : "day/month/year hour:minute:second" or "day/month/year à hour:minute:second" or "day/month/year hour:minute" or  "day/month/year à hour:minute"
 * @param {Date} date date in JavaScript format
 * @param {boolean} [separatorDateTime=true] If true, the returned string will contain the "à" character between the day/month/year and the hour:minute:second.
 * @param {boolean} [display_seconds=false] If true, the returned string will contain the seconds part.
 * @returns {String} date with the format : "day/month/year hour:minute:second" or "day/month/year à hour:minute:second" or "day/month/year hour:minute" or  "day/month/year à hour:minute"
 */
function dateToString(date, separatorDateTime = true, display_seconds = false) {
    let d = date.getDate();
    let m = date.getMonth() + 1; //Month from 0 to 11
    let y = date.getFullYear();
    let h = date.getHours();
    let min = date.getMinutes();
    return '' + (d <= 9 ? '0' + d : d) + '/' + (m<=9 ? '0' + m : m) + '/' + y + " " + (separatorDateTime ? "à " : "") + (h<=9 ? '0' + h : h) + ":" + (min<=9 ? '0' + min : min) + (display_seconds ? ":" + (date.getSeconds()<=9 ? '0' + date.getSeconds() : date.getSeconds()) : "");
}

/**
 * Transforms a Javascript Date into a Object with two sections : "date" and "time"
 * @param {Date} date date in JavaScript format
 * @returns {Object} the "date" section contains the date in the format "year-month-day", the "time" section contains the time in the format "hour:minute"
 */
function dateToStandardString(date) {
    const datetime = new Date(date);
    let d = datetime.getDate();
    let m = datetime.getMonth() + 1; //Month from 0 to 11
    let y = datetime.getFullYear();
    let h = datetime.getHours();
    let min = datetime.getMinutes();

    const formattedDate = `${y}-${m<=9 ? '0' + m : m}-${d <= 9 ? '0' + d : d}`;
    const formattedTime = `${h<=9 ? '0' + h : h}:${min<=9 ? '0' + min : min}`;

    return {"date": formattedDate, "time": formattedTime};
}

/**
 * Returns a string indicating the remaining time
 * @param {Date} date date in JavaScript format
 * @returns {String} remaining time
 */
function dateToRemainingString(date) {
    let now = new Date();

    const MILLISECONDS_PER_MINUTES = 1000 * 60;
    const minutes = Math.floor((date - now) / MILLISECONDS_PER_MINUTES);

    if (minutes <= 0) {
        return "Terminé";
    } else if (minutes < 1) {
        return "moins d'1 minute";
    } else if (minutes == 1) {
        return "1 minute";
    } else if (minutes < 60) {
        return "" + minutes + " minutes";
    } else if (Math.floor(minutes / 60) == 1) {
        return "1 heure";
    } else if (Math.floor(minutes / 60) < 24) {
        return "" + Math.floor(minutes / 60) + " heures";
    } else if (Math.floor(minutes / (60 * 24)) == 1) {
        return "1 jour";
    } else {
        return "" + Math.floor(minutes / (60 * 24)) + " jours";
    }
}

/**
 * Transforms a number into a string with the format : "x month x day x minute x sscond" where x are different numbers
 * @param {Number} seconds number of seconds
 * @returns {String} date with the format : "x month x day x minute x sscond" where x are different numbers
 */
function getReadableTime(seconds) {
    const SECONDS_PER_MINUTE = 60;
    const SECONDS_PER_HOUR = 3600;
    const SECONDS_PER_DAY = 86400;
    const SECONDS_PER_MONTH = 2592000;

    let months = Math.floor(seconds / SECONDS_PER_MONTH);
    seconds %= SECONDS_PER_MONTH;

    let days = Math.floor(seconds / SECONDS_PER_DAY);
    seconds %= SECONDS_PER_DAY;

    let hours = Math.floor(seconds / SECONDS_PER_HOUR);
    seconds %= SECONDS_PER_HOUR;

    let minutes = Math.floor(seconds / SECONDS_PER_MINUTE);
    seconds %= SECONDS_PER_MINUTE;

    let result = "";

    if (months > 0) {
        result += months + " mois ";
    }
    if (days > 0) {
        result += days + (days === 1 ? " jour" : " jours") + " ";
    }
    if (hours > 0) {
        result += hours + (hours === 1 ? " heure" : " heures") + " ";
    }
    if (minutes > 0) {
        result += minutes + (minutes === 1 ? " minute" : " minutes") + " ";
    }
    if (seconds > 0) {
        result += seconds + (seconds === 1 ? " seconde" : " secondes") + " ";
    }

    return result.trim();
}


/**
 * Transforms a number into a Object with two sections : "value" and "unit"
 * @param {Number} seconds a number of seconds
 * @returns {Object} the "value" section contains a number in a string, the "unit" section contains the time unit in a string
 */
function getReadableTimeAndUnit(seconds) {
    let hours = seconds / 3600;
    
    let unit = "h";
    if (hours % 24 === 0) {
        hours /= 24;
        unit = "j";
        if (hours % 30 === 0) {
            hours /= 30;
            unit = "mois";
        }
    }
    return { "value": hours, "unit": unit };
}