const API_IP_ADDRESS = "91.160.147.139";
const PHP_API_PORT = "38080";

let blurCompatibility = true;

if (navigator.appVersion.indexOf("Chrome/") != -1) {
    blurCompatibility = false;
}

let idMessage = 0;

/**
 * Creates and displays a popup to confirm or cancel an important action.
 * @param {String} title Title of the popup
 * @param {String} msg Message of the popup
 * @param {String} confirmBtnTitle Title of the button of confirmation
 * @param {boolean} destructive True if there is a risk of data loss or if there is a suppression of data. False otherwise.
 * @returns {boolean} True if the user confirms the action and false if he cancels it
 */
async function displayConfirm(title, msg, confirmBtnTitle, destructive = false) {
    const id = idMessage;
    idMessage++;

    const htmlPopup = `
        <div class="popup open_anim" id="confirm_popup_container${id}">
            <div id="confirm_popup${id}" class="msgbox-popup-inner ${blurCompatibility ? "backdrop-blur" : "backdrop-color"}">
                <div class="popup-content center">
                    <img src="./img/warning_ico.svg" class="ico_msgbox">
                    <p class="title_msgbox">${title}</p>
                    <p class="msg_msgbox">${msg}</p>
                    
                    <div class="actions_msgbox">
                        <button id="confirm${id}" class="shadow_btn rect_round_btn ${destructive ? "destructive" : "gray"}" type="button">${confirmBtnTitle}</button>
                        <button id="cancel${id}" class="rect_round_btn gray shadow_btn" type="button">Annuler</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML("beforeend", htmlPopup);

    const promise = new Promise((resolve, reject) => {
        document.getElementById("confirm" + id).addEventListener('click', resolve)
        document.getElementById("cancel" + id).addEventListener('click', reject)
    });


    return await promise
    .then(() => {
        hideConfirm(id);
        return true;
    })
    .catch(() => {
        hideConfirm(id);
        return false;
    })
}
 
/**
 * Hides the confirmation popup whose id is in the parameter.
 * @param {integer} id id of the popup that will be hidden
 */
async function hideConfirm(id) {
    const popupContainer = document.getElementById("confirm_popup_container" + id);
    popupContainer.classList.remove("open_anim");
    popupContainer.classList.add("close_anim");

    setTimeout(function() {
        popupContainer.remove();
    }, 300);
}

/**
 * Creates and displays an error report popup.
 * @param {String} title Title of the popup
 * @param {String} msg Message of the popup
 */
async function displayError(title, msg) {
    const id = idMessage;
    idMessage++;

    const htmlPopup = `
        <div class="popup open_anim" id="error_popup_container${id}">
            <div id="error_popup${id}" class="msgbox-popup-inner ${blurCompatibility ? "backdrop-blur" : "backdrop-color"}">    
                <div class="popup-content center">
                    <img src="./img/error_ico.svg" class="ico_msgbox">
                    <p class="title_msgbox">${title}</p>
                    <p class="msg_msgbox">${msg}</p>
                    
                    <div class="actions_msgbox">
                        <button id="close${id}" class="rect_round_btn gray shadow_btn" type="button">OK</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML("beforeend", htmlPopup);

    const promise = new Promise((resolve) => {
        document.getElementById("close" + id).addEventListener('click', resolve)
    });


    return await promise
    .then(() => {
        hideError(id);
        return;
    })
}

/**
 * Hides the error report popup whose id is in the parameter.
 * @param {integer} id id of the popup that will be hidden
 */
async function hideError(id) {
    const popupContainer = document.getElementById("error_popup_container" + id);
    popupContainer.classList.remove("open_anim");
    popupContainer.classList.add("close_anim");

    setTimeout(function() {
        popupContainer.remove();
    }, 300);
}

/**
 * Creates and displays a success report popup.
 * @param {String} title Title of the popup
 * @param {String} msg Message of the popup
 */
async function displaySuccess(title, msg) {
    const id = idMessage;
    idMessage++;

    const htmlPopup = `
        <div class="popup open_anim" id="success_popup_container${id}">
            <div id="success_popup${id}" class="msgbox-popup-inner ${blurCompatibility ? "backdrop-blur" : "backdrop-color"}">    
                <div class="popup-content center">
                    <img src="./img/success_ico.svg" class="ico_msgbox">
                    <p class="title_msgbox">${title}</p>
                    <p class="msg_msgbox">${msg}</p>
                    
                    <div class="actions_msgbox">
                        <button id="close${id}" class="rect_round_btn gray shadow_btn" type="button">OK</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML("beforeend", htmlPopup);

    const promise = new Promise((resolve) => {
        document.getElementById("close" + id).addEventListener('click', resolve)
    });


    return await promise
    .then(() => {
        hideSuccess(id);
        return;
    })
}

/**
 * Hides the success report popup whose id is in the parameter.
 * @param {integer} id id of the popup that will be hidden
 */
async function hideSuccess(id) {
    const popupContainer = document.getElementById("success_popup_container" + id);
    popupContainer.classList.remove("open_anim");
    popupContainer.classList.add("close_anim");

    setTimeout(function() {
        popupContainer.remove();
    }, 300);
}

/**
 * Displays a loading popup.
 * @param {String} msg Message of the popup
 */
async function displayLoading(msg = "Chargement...") {
    const popupContainer = document.getElementById("loading_popup_container");
    const popup = document.getElementById("loading_popup");
    popup.style.transform = "scale(1)";

    document.getElementById("loading_msg").innerHTML = msg.replace("\n", "<br>");
    
    popupContainer.style.opacity = 1;
    popupContainer.style.visibility = "inherit";
}

/**
 * Displays the loading popup.
 */
async function hideLoading() {
    const popupContainer = document.getElementById("loading_popup_container");
    popupContainer.classList.remove("displayed");
    const popup = document.getElementById("loading_popup");
    popup.removeAttribute("style");
    popupContainer.removeAttribute("style");
}

/**
 * Closes the popup whose id is in parameter
 * @param {integer} id id of the popup that will be closed
 */
async function closePopup(id) {
    document.getElementById(id).checked = false;
}

/**
 * Opens the popup whose id is in parameter
 * @param {integer} id id of the popup that will be opened
 */
async function openPopup(id) {
    document.getElementById(id).checked = true;
}

/**
 * Sends a request to retrieve data from an URL address and the data retrieval depends on the settings.
 * @param {String} url Where the data are
 * @param {Object} settings Data recovery settings
 * @returns {(json|null)}  Response from the location where the data is sent. Null if the data is not sent or not received, json if the request is sent and received. Json contains data from the url address.
 */
async function post(url, settings) {
    try {
        const response = await fetch(url, {
            method: 'post',
            body: JSON.stringify(settings),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        let res = await response.json();
        if (response.status === 200 && res["success"] == true) {
            if (res["data"] != undefined) {
                return res["data"];
            }
            return res;
        } else {
            displayError(res["error"]["title"], "La requête a retourné une erreur... " + res["error"]["message"]);
        }
    } catch (e) {
        displayError("Erreur d'émission/réception de la requête", "La requête vers l'adresse \"" + url + "\" n'a pas pu être émise/reçu correctement... " + e.toString());
    }

    return null;
}


/**
 * Sends a request to retrieve data from an URL address and the data retrieval depends on the settings. (The retrieved data format is used to create a downloadable file)
 * @param {String} url Where the data are
 * @param {Object} settings Data recovery settings
 * @returns {(JSON|null)} Response from the location where the data are. Null if the request is not sent or not received at the url address, json if the request is sent and received. Json contains data from the url address.
 */
async function postGetFile(url, settings) {
    try {
        const response = await fetch(url, {
            method: 'post',
            body: JSON.stringify(settings),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        if (response.status === 200) {
            let data = await response.blob();
            return data;
        } else {
            let res = await response.json();
            displayError(res["error"]["title"], "La requête a retourné une erreur... " + res["error"]["message"]);
        }
    } catch (e) {
        displayError("Erreur d'émission/réception de la requête", "La requête vers l'adresse \"" + url + "\" n'a pas pu être émise/reçu correctement... " + e.toString());
    }

    return null;
}


/**
 * Sends a request to retrieve data from an url address.
 * @param {String} url Where the data are
 * @returns {(JSON|null)} Response from the location where the data are. Null if the request is not sent or not received at the url address, json if the request is sent and received. Json contains data from the url address.
 */
async function get(url) {
    try {
        const response = await fetch(url, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        let res = await response.json();
        if (response.status === 200 && res["success"] == true) {
            if (res["data"] != undefined) {
                return res["data"];
            }
            return res;
        } else {
            displayError(res["error"]["title"], "La requête a retourné une erreur... " + res["error"]["message"]);
        }
    } catch (e) {
        displayError("Erreur d'émission/réception de la requête", "La requête vers l'adresse \"" + url + "\" n'a pas pu être émise/reçu correctement... " + e.toString());
    }

    return null;
}

/**
 * Sends a request to retrieve data from an url address linked to a php file and the data retrieval depends on the settings.
 * @param {String} url Where the data are
 * @param {Object} settings Data recovery settings
 * @returns {(JSON|null)} Response from the location where the data are. Null if the request is not sent or not received at the url address, json if the request is sent and received. Json contains data from the url address.
 */
async function phpPost(url, settings) {
    return await post("http://" + API_IP_ADDRESS + ":" + PHP_API_PORT + url, settings);
}

/**
 * Sends a request to retrieve data from an url address linked to a php file and the data retrieval depends on the settings. (The retrieved data format is used to create a downloadable file)
 * @param {String} url Where the data are
 * @param {Object} settings Data recovery settings
 * @returns {(JSON|null)} Response from the location where the data are. Null if the request is not sent or not received at the url address, json if the request is sent and received. Json contains data from the url address.
 */
async function phpPostGetFile(url, settings) {
    return await postGetFile("http://" + API_IP_ADDRESS + ":" + PHP_API_PORT + url, settings);
} 

/**
 * Sends a request to retrieve data from an url address linked to a php file.
 * @param {String} url Where the data are
 * @returns {(JSON|null)} Response from the location where the data are. Null if the request is not sent or not received at the url address, json if the request is sent and received. Json contains data from the url address.
 */
async function phpGet(url) { 
    return await get("http://" + API_IP_ADDRESS + ":" + PHP_API_PORT + url);
} 

/**
 * Transforms a Javascript Date into a string with the format : "day/month/year hour:minute:second" or "day/month/year à hour:minute:second" or "day/month/year hour:minute" or  "day/month/year à hour:minute"
 * @param {Date} date date in JavaScript format
 * @param {boolean} separatorDateTime If true, the returned string will contain the "à" character between the day/month/year and the hour:minute:second.
 * @param {boolean} display_seconds If true, the returned string will contain the seconds part.
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

    if (minutes < 1) {
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
 * Transforms a integer into a string with the format : "x month x day x minute x sscond" where x are different numbers
 * @param {integer} seconds number of seconds
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
        result += months + "mois ";
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
 * Transforms a integer into a Object with two sections : "value" and "unit"
 * @param {integer} seconds a number of seconds
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

/**
 * Returns "Activé" or "Désactivé" according to bool
 * @param {boolean} bool If true, the returned string will contain "Activé", "Désactivé" if not
 * @returns {String} contains "Activé" or "Désactivé"
 */
function getReadableBool(bool) {
    return bool ? "Activé" : "Désactivé";
}

/**
 * Checks if the raspberry pi's time is the same as that of the device using the website.
 */
async function checkTime() {
    const client_datetime = new Date();
    const data = await phpPost("/phpApi/checkTime.php", {
        "client_datetime": client_datetime
    });

    if (data!=null && data["up_to_date"]==false){
        if (await displayConfirm("Potentiel décalage d'heure détécté", "Il semblerait que la date et l'heure de la cellule de mesure soit décalé par rapport à votre appareil. Voulez-vous mettre à jour la date et l'heure de la cellule ?", 'Changer la date & heure', false) == true) {
            // redirect
            window.location = "/setupTime.php"
        }
    }
}

/**
 * Set refresh delay
 * @param {integer} milliSeconds Time of delay
 */
async function delay(milliSeconds) {
    // return await for better async stack trace support in case of errors.
    return await new Promise(resolve => setTimeout(resolve, milliSeconds));
}

/**
 * Hide an icon of a HTML page
 * @param {HTMLElement} icon where the function has been called
 * @param {String} id id of a HTML element
 */
function displayHide(icon, id) {
    let input = this.document.getElementById(id);
    if (icon.classList.contains('btn-eye-show')) {
        icon.classList.add('btn-eye-hide');
        icon.classList.remove('btn-eye-show');
        input.setAttribute('type', 'text')
    } else {
        icon.classList.add('btn-eye-show');
        icon.classList.remove('btn-eye-hide');
        input.setAttribute('type', 'password')
    }
} 