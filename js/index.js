let capacityPercent = 0;

async function getCampagnes(filter = null) {
    const campagnesContainer = document.getElementById("CM_container");
    campagnesContainer.innerHTML = `
    <div class="loading_popup" id="loading_div">
        <svg class="spinner" viewBox="0 0 50 50">
            <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
        </svg>
        <p class="loading_msg">Récupération des campagnes...</p>
    </div>
    `;

    let data = null;
    if (filter != null) {
        data = await PHP_post("/PHP_API/get_campaigns.php", filter);
    } else {
        data = await PHP_get("/PHP_API/get_campaigns.php");
    }

    if (data != null){
        const campagnesContainer = document.getElementById("CM_container");
        campagnesContainer.innerHTML = "";

        data["data"].forEach(campagne => {
            let state = "";
            let state_desc = "";
            let state_ico = "";
            let dateFin = new Date(campagne["beginDate"]);
            dateFin.setSeconds(dateFin.getSeconds() + campagne["duration"]);
            

            switch (campagne["state"]) {
                case 0: // En cours
                    state = "processing";
                    state_desc = `En cours (reste ${dateToReamingString(dateFin)})...`;
                    state_ico = "working_status";
                    break;

                case 1: // Terminé
                    state = "";
                    state_desc = `Terminé le ${dateToString(dateFin)}.`;
                    state_ico = "success_status";
                    break;
                
                default:
                    break;
            }

            campagnesContainer.innerHTML += `
                <form method="post" action="/voirReleve.php" class="CM ${state}" id="campagne_${campagne["idCampaign"]}" onclick="document.getElementById('campagne_${campagne["idCampaign"]}').submit();">
                    <input type="hidden" name="id" value="${campagne["idCampaign"]}">
                    <div class="title_detail_CM">
                        <p class="titre_CM">${campagne["name"]}</p>
                        <p class="detail_CM">
                            <img class="etat_CM" src="./img/${state_ico}.svg">
                            ${state_desc}
                        </p>
                    </div>

                    <button type="button" id="removeCampaign" class="square_btn destructive remove small" onclick="removeCampagne(${campagne["idCampaign"]})"></button>
                </form>
            `;
        });
    }

    const loading = document.getElementById("loading_div");
    if (loading != null) {
        loading.remove();
    }
}

async function filterCampagnes() {
    const name = document.getElementById("campaign_name_search_bar").value;
    const date = document.getElementById("campaign_date").value;
    const time = document.getElementById("campaign_time").value;
    const processing = document.getElementById("processing").checked;

    closePopup("filter-popup");

    getCampagnes({"name": name.toLowerCase(), "date": date, "time": time, "processing": processing});
}

async function getStorageCapacity() {
    const storageBar = document.getElementById("used_storage_bar");
    const storageCapacity = document.getElementById("storage_txt");

    storageCapacity.innerHTML = "Calcul...";
    storageBar.style.width = "0%";

    let data = await NODERED_get("/storage");

    if (data != null){
        capacityPercent = data["used_percent"];

        storageCapacity.innerHTML = capacityPercent + "% utilisé(s) • " + data["reaming_hours"] + "h restantes";
        storageBar.style.width = capacityPercent + "%";
    }
}

async function addCampagne() {
    displayLoading("Ajout de la campagne...");

    const title = document.getElementById("name_input");
    const CO2_enabled = document.getElementById("CO2_checkbox");
    const O2_enabled = document.getElementById("O2_checkbox");
    const temperature_enabled = document.getElementById("temperature_checkbox");
    const luminosity_enabled = document.getElementById("luminosity_checkbox");
    const humidity_enabled = document.getElementById("humidity_checkbox");
    const duration = document.getElementById("duration_input");
    const duration_unit = document.getElementById("duration_unit_combo_box");
    const interval = document.getElementById("interval_input");
    const interval_unit = document.getElementById("interval_unit_combo_box");
    const volume = document.getElementById("volume_input");
    const volume_unit = document.getElementById("volume_unit_combo_box");

    if (title.validity.badInput === true) {
        hideLoading();
        displayError("Impossible d'ajouter la campagne", "Le titre de la campagne n'a pas été renseigné. Veuillez donner un titre à la campagne puis réessayez.");
        return;
    }
    if (duration.validity.badInput === true) {
        hideLoading();
        displayError("Impossible d'ajouter la campagne", "La durée de la campagne n'a pas été renseigné ou son format est incorrecte. Veuillez renseigner un nombre entier positif puis réessayez.");
        return;
    }
    if (interval.validity.badInput === true) {
        hideLoading();
        displayError("Impossible d'ajouter la campagne", "L'intervalle de relevé de la campagne n'a pas été renseigné ou son format est incorrecte. Veuillez renseigner un nombre entier positif puis réessayez.");
        return;
    }
    if (volume.validity.badInput === true) {
        hideLoading();
        displayError("Impossible d'ajouter la campagne", "Le format du volume de la campagne est incorrecte. Veuillez entrer un nombre décimal positif puis réessayer.");
        return;
    }

    /*const data_ = await NODERED_post_post("/add_campaign", {
        "CO2_enabled": CO2_enabled.checked,
        "O2_enabled": O2_enabled.checked,
        "temperature_enabled": temperature_enabled.checked,
        "luminosity_enabled": luminosity_enabled.checked,
        "humidity_enabled": humidity_enabled.checked,
        "duration": duration.value,
        "interval": interval.value,
    });
    if (data_ != null) {
        return;
    }*/

    const data = await PHP_post("/PHP_API/add_campaign.php", {
        "title": title.value,
        "CO2_enabled": CO2_enabled.checked,
        "O2_enabled": O2_enabled.checked,
        "temperature_enabled": temperature_enabled.checked,
        "luminosity_enabled": luminosity_enabled.checked,
        "humidity_enabled": humidity_enabled.checked,
        "duration": duration.value,
        "duration_unit": duration_unit.value,
        "interval": interval.value,
        "interval_unit": interval_unit.value,
        "volume": volume.value,
        "volume_unit": volume_unit.value
    });

    if (data != null) {
        document.getElementById("id_added_campaign").value = data["id"];
        document.getElementById("add_popup_form").submit();
    }

    hideLoading();
}

async function removeCampagne(id) {
    event.stopPropagation();

    if (await displayConfirm('Voulez-vous vraiment supprimer cette campagne de mesure ?', 'Cette campagne et ses mesures seront supprimées définitivement. Cette action est irréversible.', 'Supprimer', true) == true) {
        document.getElementById("campagne_" + id).remove();
        PHP_post("/PHP_API/remove_campaign.php", {
            "id": id
        });
    }
}

function handleKeyPressSearchBar(e){
    var key=e.keyCode || e.which;
     if (key==13){
        filterCampagnes();
     }
   }

document.addEventListener("DOMContentLoaded", () => {
    getCampagnes();
    getStorageCapacity();
});