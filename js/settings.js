let networkSsid;
let networkPassword;

/**
 * Retrieves the settings from the server and displays them in the page.
 */
async function getSettings()
{
    displayLoading("Récupération des paramètres...");

    const settings = await phpGet("phpApi/getSettings.php");
    if (settings != null){
        if (settings["autoRemove"]){
            document.getElementById("auto_suppr").checked=true;
        }else{
            document.getElementById("auto_suppr").checked=false;
        }
        
        const timeSettings = getReadableTimeAndUnit(settings["removeInterval"]);
        let timeConservation = document.getElementById("conserv");
        timeConservation.setAttribute('value',timeSettings["value"]);

        let timeConservationUnit = document.querySelector('#comboBoxTpsSuppr option[value="' + timeSettings["unit"] + '"]');
        if(timeConservationUnit){
            timeConservationUnit.setAttribute('selected','selected');
        }

        let networkSsidInput = document.getElementById("network_ssid");
        networkSsidInput.value=settings["ssid"];
        networkSsid=settings["ssid"];

        let networkPasswordInput = document.getElementById("network_password");
        networkPasswordInput.value=settings["password"];
        networkPassword=settings["password"];
    }

    hideLoading();
}

/**
 * Sends a request to the server to update the settings.
 * If the password or ssid has been changed, a confirmation message will be displayed to the user.
 * @returns {Promise<void>}
 */
async function setSettings()
{
    displayLoading("Mise à jour des paramètres...");

    const enableAutoRemove = document.getElementById("auto_suppr");
    const timeConservation = document.getElementById("conserv");
    const timeConservationUnit = document.getElementById("comboBoxTpsSuppr");
    const ssid = document.getElementById("network_ssid");
    const password = document.getElementById("network_password");


    if (timeConservation.validity.badInput === true) {
        hideLoading();
        displayError("Impossible de sauvegarder les paramètres", "L'intervalle de relevé de suppression des campagnes n'a pas été renseigné ou son format est incorrecte. Veuillez renseigner un nombre entier positif puis réessayez.");
        return;
    } 
    
    let data = await phpPost("phpApi/setSettings.php", {
        "timeConservation": timeConservation.value,
        "timeConservationUnit": timeConservationUnit.value,
        "enableAutoRemove": enableAutoRemove.checked,
        "ssid": ssid.value,
        "password": password.value
    });

    if (data != null) {
        if (password.value != null && password.value != networkPassword) {
            if (!await displayConfirm("Risque de perte d'accès", "ATTENTION : Vous venez de modifier le mot de passe du Wi-Fi de la cellule de mesure. Cela signifie que si vous n'entrez pas correctement le nouveau mot de passe, vous ne pourrez plus accéder à votre cellule de mesure. Nous vous conseillons vivement de télécharger le nouveau QR code d'accès au Wi-Fi afin d'éviter tout problème d'oubli/mot de passe mal copié !", 'Ne pas télécharger', true, "Télécharger le nouveau code QR")) {
                downloadQRCode();
            } else if (!await displayConfirm("Risque de perte d'accès", "Êtes vous certains de continuer sans télécharger le nouveau code QR ?", 'Oui', true, "Télécharger le nouveau code QR")) {
                downloadQRCode();
            }
        }
    
        if((password.value != null && password.value != networkPassword) || (ssid.value != null && ssid.value != networkSsid)) {   
            if (await displayConfirm("Information de connexion Wi-Fi modifié", "Vous avez changer les informations de connexion au réseau Wi-Fi de la cellule de mesure, cependant pour que ce changement soit visible il faut redémarrer l'appareil. Cela entraînera l'arrêt de campagne en cours. Voulez-vous redémarrer maintenant ?", 'Redémarrer la cellule', true, "Non")) {
                await phpGet("phpApi/restart.php");
            }            
        }

        displaySuccess("Paramètres mis à jour !", "Les paramètres ont été mis à jour avec succès.");
    }
    
    hideLoading();
}

/**
 * Sends a request to the server to reset all the data of the device.
 * If the user confirms the action, the user will be redirected to the beginning page.
 */
async function reset()
{
    if (await displayConfirm('Voulez-vous vraiment supprimer toutes les données de cet appareil ?', 'Toutes les campagnes, les mesures, les paramètres et les configurations seront supprimées définitivement. Cette action est irréversible.', 'Effacer', true)) {
        displayLoading("Suppression des données...");
        
        const data = await phpPost("phpApi/reset.php");

        hideLoading();

        if(data != null){
            await displaySuccess("Données supprimées !", "Toutes les campagnes, les mesures, les logs, les paramètres et les configurations ont été supprimées avec succès. Vous allez être redirigés sur la page de première configuration de l'appareil.");
            // redirect
            window.location = "/beginning.php"
        }        
    }
}

/**
 * Download and displays QR Code to access the Wi-Fi of the Raspberry Pi
 */
async function displayQRCode()
{
    const ssid = document.getElementById("network_ssid");
    const password = document.getElementById("network_password");

    // Check password/ssid was edited from IU. If so, ask user to save first or refresh page to discard changes.
    if ((password.value != null && password.value != networkPassword) || (ssid.value != null && ssid.value != networkSsid)) {
        if (!await displayConfirm('Modification non sauvegardée', "Le nom et/ou le mot de passe du réseau Wi-Fi a été modifié sur cette page et les chagements n'ont pas été sauvegardés. Le code QR généré ne prendra pas en compte ces modifications. Voulez-vous tout de même voir le code QR ?", 'Voir', false)) {
            return;
        }
    } 

    displayLoading("Génération du QR code...");
    
    let img = document.getElementById("qr_code_viewer");

    const blob = await nodeJsGet("getQRCode", false);
    if (blob != null) {
        img.src = window.URL.createObjectURL(blob);
        openPopup("qr-popup");
    }


    hideLoading();
}

/**
 * Downloads the QR Code to access the Wi-Fi of the Raspberry Pi and transfers it to the browser.
 */
async function downloadQRCode()
{
    displayLoading("Génération du QR code...");
    
    const success = await nodeJsDownload("Code QR Wi-Fi cellule mesure.png", "getQRCode");
    if (success) {
        displaySuccess("Téléchargement réussi !", "Le code QR a été téléchargé avec succès. Vous pouvez le retrouver dans le dossier \"Téléchargement\" de votre appareil.");
        closePopup("qr-popup");
    }

    hideLoading();
}

document.addEventListener("DOMContentLoaded", () => {
    getSettings();
});
