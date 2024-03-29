/**
 * Recovering raspberry pi settings.
 */
async function getSettings()
{
    displayLoading("Récupération des paramètres...");

    const settings = await phpGet("/phpApi/getSettings.php");
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

        let networkSsid = document.getElementById("network_ssid");
        networkSsid.value=settings["ssid"];

        let networkPassword = document.getElementById("network_password");
        networkPassword.value=settings["password"];
    }

    hideLoading();
}


/**
 * Update raspberry pi settings.
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
    
    let data1 = await phpPost("/phpApi/setSettings.php", {
        "timeConservation": timeConservation.value,
        "timeConservationUnit": timeConservationUnit.value,
        "enableAutoRemove": enableAutoRemove.checked,
        "network": ssid.value,
        "password": password.value
    });

    if(network.value!=null && network.value!=raspberryNetwork.name){   
        if (await displayConfirm("Changement du nom du WIFI", "Vous avez changer le nom du WIFI de la cellule cependant pour que ce changement soit visible il faut redémarrer l'appareil. Cela entraînera l'arrêt de campagne en cours. Voulez-vous mettre à jour la date et l'heure de la cellule ?", 'Redémarrer la cellule', false) == true) {
            //restart
            await phpGet("/phpApi/restart.php");
        }            
    }

    hideLoading();

    if(data1 != null){
        displaySuccess("Paramètres mis à jour !", "Les paramètres ont été mis à jour avec succès.");
    } 

}

/**
 * Delete all data of the Raspberry pi
 */
async function reset()
{
    if (await displayConfirm('Voulez-vous vraiment supprimer toutes les données de cet appareil ?', 'Toutes les campagnes, les mesures, les paramètres et les configurations seront supprimées définitivement. Cette action est irréversible.', 'Effacer', true) == true) {
        displayLoading("Suppression des données...");
        
        const data = await phpPost("/phpApi/reset.php");

        hideLoading();

        if(data != null){
            await displaySuccess("Données supprimées !", "Toutes les campagnes, les mesures, les logs, les paramètres et les configurations ont été supprimées avec succès. Vous allez être redirigés sur la page de première configuration de l'appareil.");
            // redirect
            window.location = "/beginning.php"
        }        
    }
}

/**
 * Display QR Code to access the Raspi
 */
async function displayQRcode()
{
    // Check password/ssid was edited from IU. If so, ask user to save first or refresh page to discard changes.
    if (true) {
        displayError('Modification non sauvegardée', "Le nom et/ou le mot de passe du réseau Wifi a été modifié sur cette page et les chagements n'ont pas été sauvegardés. Veuillez enregistrer les modifications ou rafraîchissez la page pour les abandonnées ; puis réessayer.")
        return;
    } 

    displayLoading("Génération du QR code...");
    
    // Remove and then recreate img HTML componants with src = ./PHP_API/getQRcode.php

    hideLoading();
}

document.addEventListener("DOMContentLoaded", () => {
    getSettings();
});
