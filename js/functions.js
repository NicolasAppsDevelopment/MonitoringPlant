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

async function post(url, data) {
    try {
        const response = await fetch("http://localhost:1880" + url, {
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
        const response = await fetch("http://localhost:1880" + url, {
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