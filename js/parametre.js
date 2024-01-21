async function getParametre()
{
    displayLoading("Récupération des paramètres...");

    const data = await PHP_get("/PHP_API/get_settings.php");
    if (data != null){
        if (data["autoRemove"]){
            document.getElementById("auto_suppr").checked=true;
        }else{
            document.getElementById("auto_suppr").checked=false;
        }
        
        const timeData = getReadableTimeAndUnit(data["removeInterval"]);
        let valeur = document.getElementById("conserv");
        valeur.setAttribute('value',timeData["value"]);

        var els = document.querySelector('#comboBoxTpsSuppr option[value="' + timeData["unit"] + '"]');
        if(els){
            els.setAttribute('selected','selected');
            //or els.selected = true;
        }
    }

    hideLoading();
}

async function postParametre()
{
    displayLoading("Mise à jour des paramètres...");

    const enable_auto_remove = document.getElementById("auto_suppr");
    const interval = document.getElementById("conserv");
    const interval_unit = document.getElementById("comboBoxTpsSuppr");

    if (interval.validity.badInput === true) {
        hideLoading();
        displayError("Impossible de sauvegarder les paramètres", "L'intervalle de relevé de suppression des campagnes n'a pas été renseigné ou son format est incorrecte. Veuillez renseigner un nombre entier positif puis réessayez.");
        return;
    } 

    let data = await PHP_post("/PHP_API/set_settings.php", {
        "autoremove.interval": interval.value,
        "autoremove.interval_unit": interval_unit.value,
        "autoremove.enabled": enable_auto_remove.checked
    });
    
    if(data != null){
        displaySuccess("Paramètres mis à jour !", "Les paramètres ont été mis à jour avec succès.");
    }

    hideLoading();
}

async function postDeleteAll()
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
        window.location = "/setup_time.php"
    }
}

document.addEventListener("DOMContentLoaded", () => {
    getParametre();
});