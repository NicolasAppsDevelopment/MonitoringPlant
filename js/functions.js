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


document.addEventListener("DOMContentLoaded", () => {
    displayError("Impossible de récupérer les données", "xxxxxxx xxxxxxx xxxx xxxxx x xxxxxxxxx x xxxxxxxx xxxx. xxxxxxxxxxxx xxxxxxx xxxxxxx xxx xxx xxxxxxxxxx. Une erreur s'est produite et à empêché l'application de récupérer les informations relatives à cette campagne... \nDétails : SQLNOTFOUND table campagnes missing");
});