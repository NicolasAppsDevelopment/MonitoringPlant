/**
 * Recovering raspberry pi settings.
 */
async function getSettings()
{
    displayLoading("Récupération des paramètres...");

    //Print the wifi name
    const accesPoint = await NODERED_get("/getAccessPoint");
    let network = document.getElementById("network");
    network.value=accesPoint["name"];

    
    const settings = await PHP_get("/PHP_API/getSettings.php");
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
    const network = document.getElementById("network");


    if (timeConservation.validity.badInput === true) {
        hideLoading();
        displayError("Impossible de sauvegarder les paramètres", "L'intervalle de relevé de suppression des campagnes n'a pas été renseigné ou son format est incorrecte. Veuillez renseigner un nombre entier positif puis réessayez.");
        return;
    } 

    const raspberryNetwork = await NODERED_get("/getAccessPoint");
    
    let data1 = await PHP_post("/PHP_API/setSettings.php", {
        "timeConservation": timeConservation.value,
        "timeConservationUnit": timeConservationUnit.value,
        "enableAutoRemove": enableAutoRemove.checked,
        "network": network.value
    });

    if(network.value!=null && network.value!=raspberryNetwork.name){   
        if (await displayConfirm("Changement du nom du WIFI", "Vous avez changer le nom du WIFI de la cellule cependant pour que ce changement soit visible il faut redémarrer l'appareil. Cela entraînera l'arrêt de campagne en cours. Voulez-vous mettre à jour la date et l'heure de la cellule ?", 'Redémarrer la cellule', false) == true) {
            //restart
            await PHP_get("/PHP_API/restart.php");
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
        
        const data = await PHP_post("/PHP_API/reset.php");

        hideLoading();

        if(data != null){
            await displaySuccess("Données supprimées !", "Toutes les campagnes, les mesures, les logs, les paramètres et les configurations ont été supprimées avec succès. Vous allez être redirigés sur la page de première configuration de l'appareil.");
            // redirect
            window.location = "/beginning.php"
        }        
    }
}

document.addEventListener("DOMContentLoaded", () => {
    getSettings();
});