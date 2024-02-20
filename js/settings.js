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
    const altitude = document.getElementById("altitude");


    if (timeConservation.validity.badInput === true) {
        hideLoading();
        displayError("Impossible de sauvegarder les paramètres", "L'intervalle de relevé de suppression des campagnes n'a pas été renseigné ou son format est incorrecte. Veuillez renseigner un nombre entier positif puis réessayez.");
        return;
    } 

    
    let data1 = await PHP_post("/PHP_API/setSettings.php", {
        "timeConservation": timeConservation.value,
        "timeConservationUnit": timeConservationUnit.value,
        "enableAutoRemove": enableAutoRemove.checked,
        "altitude":altitude.value,
        "network": network.value
    });

    const raspberryNetwork = await NODERED_get("/getAccessPoint");

    if(network.value!=null && network.value!=raspberryNetwork){      
        if (await displayConfirm("Changement du nom du WIFI", "Vous avez changer le nom du WIFI de la cellule cependant pour que ce changement soit visible il faut redémarrer l'appareil. Cela entraînera l'arrêt de campagne en cours. Voulez-vous mettre à jour la date et l'heure de la cellule ?", 'Redémarrer la cellule', false) == true) {
            //restart
            const data3 = await NODERED_get("/restart");
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
    if (await displayConfirm('Voulez-vous vraiment supprimer toutes les données de cet appareil ?', 'Toutes les campagnes, mesures et paramètres seront supprimées définitivement. Cette action est irréversible.', 'Effacer', true) == true) {
        displayLoading("Suppression des données...");

        const securityKey="I_do_believe_I_am_on_fire"
        
        const data = await PHP_post("/PHP_API/reset.php", {
            "key": securityKey
        });

        if(data != null){
            displaySuccess("Données supprimées !", "Toutes les campagnes, mesures, logs et paramètres ont été supprimées avec succès.");
        }


        hideLoading();
        // redirect
        window.location = "/setupTime.php"
    }
}

document.addEventListener("DOMContentLoaded", () => {
    getSettings();
});