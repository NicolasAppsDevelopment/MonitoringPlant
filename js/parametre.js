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

        const datetime = dateToStandardString(data['date']);

        const date = document.getElementById("dateRasp");
        const time = document.getElementById("timeRasp");
        date.value = datetime["date"];
        time.value = datetime["time"];

        var els = document.querySelector('#comboBoxTpsSuppr option[value="' + timeData["unit"] + '"]');
        if(els){
            els.setAttribute('selected','selected');
            //or els.selected = true;
        }

        const now = new Date(date.value + " " + time.value);
        seconds = now.getSeconds();
        setInterval(() => {
            seconds++;
            if (seconds >= 60) {
                seconds = 0;

                const now_ = new Date(date.value + " " + time.value);
                now_.setMinutes(now_.getMinutes() + 1);

                const datetime_ = dateToStandardString(now_);
                const date_ = datetime_["date"];
                const time_ = datetime_["time"];
                time.value = time_;
                date.value = date_;
            }
        }, 1000);
    }

    hideLoading();
}

async function postParametre()
{
    displayLoading("Mise à jour des paramètres...");

    const enable_auto_remove = document.getElementById("auto_suppr");
    const interval = document.getElementById("conserv");
    const interval_unit = document.getElementById("comboBoxTpsSuppr");
    const date = document.getElementById("dateRasp");
    const time = document.getElementById("timeRasp");

    if (interval.validity.badInput === true) {
        hideLoading();
        displayError("Impossible de sauvegarder les paramètres", "L'intervalle de relevé de suppression des campagnes n'a pas été renseigné ou son format est incorrecte. Veuillez renseigner un nombre entier positif puis réessayez.");
        return;
    }
    if (date.validity.badInput === true) {
        hideLoading();
        displayError("Impossible de sauvegarder les paramètres", "La nouvelle date n'a pas été renseigné ou son format est incorrecte. Veuillez renseigner une date puis réessayez.");
        return;
    }
    if (time.validity.badInput === true) {
        hideLoading();
        displayError("Impossible de sauvegarder les paramètres", "La nouvelle heure n'a pas été renseigné ou son format est incorrecte. Veuillez renseigner une heure puis réessayez.");
        return;
    }

    var data = await PHP_post("/PHP_API/set_settings.php", {
        "autoremove.interval": interval.value,
        "autoremove.interval_unit": interval_unit.value,
        "autoremove.enabled": enable_auto_remove.checked
    });
    
    if(data != null){
        if (dateChanged) {
            displayLoading("Mise à jour de l'heure...");
            const datetime = String(date.value + " " + time.value);
        
            const data_ = await NODERED_post("/set_datetime", {
                "datetime": datetime,
            });
        }

        displaySuccess("Paramètres mis à jour !", "Les paramètres ont été mis à jour avec succès.");
    }

    hideLoading();
}

async function postDeleteAll()
{
    if (await displayConfirm('Voulez-vous vraiment supprimer toutes les données de cet appareil ?', 'Toutes les campagnes, mesures et paramètres seront supprimées définitivement. Cette action est irréversible.', 'Effacer', true) == true) {
        displayLoading("Suppression des données...");
    
        var data = await NODERED_post("/format", {
            "key": "securityKey"
        });
        
        if(data != null){
            displaySuccess("Données supprimées !", "Toutes les campagnes, mesures et paramètres ont été supprimées avec succès.");
        }

        hideLoading();
    }
}

async function resetSeconds() {
    seconds = 0;
    dateChanged = true;
}

let seconds = 0;
let dateChanged = false;

document.addEventListener("DOMContentLoaded", () => {
    getParametre();
});