async function displayError(title, msg) {
    const popup_container = document.getElementById("error_popup_container");
    const popup = document.getElementById("error_popup");
    popup.style.transform = "scale(1)";

    document.getElementById("error_msg").innerHTML = msg.replace("\n", "<br>");
    document.getElementById("error_title").innerHTML = title; 
    
    popup_container.style.opacity = 1;
    popup_container.style.visibility = "inherit";
}
async function hideError() {
    const popup_container = document.getElementById("error_popup_container");
    const popup = document.getElementById("error_popup");
    popup.removeAttribute("style");
    popup_container.removeAttribute("style");
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
    const popup = document.getElementById("loading_popup");
    popup.removeAttribute("style");
    popup_container.removeAttribute("style");
}

const API_IP_ADDRESS = "localhost";
const PHP_API_PORT = "8080";
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

function dateToString(date) {
    let d = date.getDate();
    let m = date.getMonth() + 1; //Month from 0 to 11
    let y = date.getFullYear();
    let h = date.getHours();
    let min = date.getMinutes();
    return '' + (d <= 9 ? '0' + d : d) + '/' + (m<=9 ? '0' + m : m) + '/' + y + " à " + (h<=9 ? '0' + h : h) + ":" + (min<=9 ? '0' + min : min);
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