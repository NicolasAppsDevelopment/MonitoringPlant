let blurCompatibility = true;

if (navigator.appVersion.indexOf("Chrome/") != -1) {
    blurCompatibility = false;
}

let id_error = 0;
let id_confirm = 0;

async function displayConfirm(title, msg, confirmBtnTitle, destructive = false) {
    const id = id_confirm;
    id_confirm++;

    const html_popup = `
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

    document.body.insertAdjacentHTML("beforeend", html_popup);

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

async function hideConfirm(id) {
    const popup_container = document.getElementById("confirm_popup_container" + id);
    popup_container.classList.remove("open_anim");
    popup_container.classList.add("close_anim");

    setTimeout(function() {
        popup_container.remove();
    }, 300);
}

async function displayError(title, msg) {
    const id = id_error;
    id_error++;

    const html_popup = `
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

    document.body.insertAdjacentHTML("beforeend", html_popup);

    const promise = new Promise((resolve) => {
        document.getElementById("close" + id).addEventListener('click', resolve)
    });


    return await promise
    .then(() => {
        hideError(id);
        return;
    })
}

async function hideError(id) {
    const popup_container = document.getElementById("error_popup_container" + id);
    popup_container.classList.remove("open_anim");
    popup_container.classList.add("close_anim");

    setTimeout(function() {
        popup_container.remove();
    }, 300);
}

async function displayLoading(msg = "Chargement...") {
    const popup_container = document.getElementById("loading_popup_container");
    const popup = document.getElementById("loading_popup");
    popup.style.transform = "scale(1)";

    document.getElementById("loading_msg").innerHTML = msg.replace("\n", "<br>");
    
    popup_container.style.opacity = 1;
    popup_container.style.visibility = "inherit";
}
async function hideLoading() {
    const popup_container = document.getElementById("loading_popup_container");
    popup_container.classList.remove("displayed");
    const popup = document.getElementById("loading_popup");
    popup.removeAttribute("style");
    popup_container.removeAttribute("style");
}

const API_IP_ADDRESS = "91.160.147.139";
const PHP_API_PORT = "35000";
const NODERED_API_PORT = "1880"; 

async function post(url, data) {
    try {
        const response = await fetch(url, {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        var res = await response.json();
        if (response.status === 200) {
            return res;
        } else {
            displayError(res["title"], "La requête a retourné une erreur... " + res["error"]);
        }
    } catch (e) {
        displayError("Erreur d'émission de la requête", "La requête à vers l'adresse \"" + url + "\" n'a pas pu être émise correctement... " + e.toString());
    }

    return null;
}
async function get(url) {
    try {
        const response = await fetch(url, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        var res = await response.json();
        if (response.status === 200) {
            return res;
        } else {
            displayError(res["title"], "La requête a retourné une erreur... " + res["error"]);
        }
    } catch (e) {
        displayError("Erreur d'émission de la requête", "La requête à vers l'adresse \"" + url + "\" n'a pas pu être émise correctement... " + e.toString());
    }

    return null;
}

async function PHP_post(url, data) {
    return await post("http://" + API_IP_ADDRESS + ":" + PHP_API_PORT + url, data);
} 

async function PHP_get(url) { 
    return await get("http://" + API_IP_ADDRESS + ":" + PHP_API_PORT + url);
} 

async function NODERED_post(url, data) {
    return await post("http://" + API_IP_ADDRESS + ":" + NODERED_API_PORT + url, data);
} 

async function NODERED_get(url) {
    return await get("http://" + API_IP_ADDRESS + ":" + NODERED_API_PORT + url);
} 

function dateToString(date, str_separator_date_time = true, display_seconds = false) {
    let d = date.getDate();
    let m = date.getMonth() + 1; //Month from 0 to 11
    let y = date.getFullYear();
    let h = date.getHours();
    let min = date.getMinutes();
    return '' + (d <= 9 ? '0' + d : d) + '/' + (m<=9 ? '0' + m : m) + '/' + y + " " + (str_separator_date_time ? "à " : "") + (h<=9 ? '0' + h : h) + ":" + (min<=9 ? '0' + min : min) + (display_seconds ? ":" + (date.getSeconds()<=9 ? '0' + date.getSeconds() : date.getSeconds()) : "");
}

function dateToReamingString(date) {
    let now = new Date();

    const MS_PER_MINUTES = 1000 * 60;
    const minutes = Math.floor((date - now) / MS_PER_MINUTES);

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
    } else if (Math.floor(minutes / (60 * 60)) == 1) {
        return "1 jour";
    } else {
        return "" + Math.floor(minutes / (60 * 60)) + " jours";
    }
}