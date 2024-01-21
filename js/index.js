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

        let campagnesContainerHTML = "";

        data["data"].forEach(campagne => {
            let state = "";
            let state_desc = "";
            let state_ico = "";
            
            if (campagne["finished"] == 0) {
                // la campagne n'est pas fini
                state = "processing";
                state_desc = `En cours (reste ${dateToReamingString(campagne["endingDate"])})...`;
                state_ico = "working_status";
            } else {
                // la campagne est fini
                state_desc = `Terminé le ${dateToString(campagne["endingDate"])}.`;
            }

            switch (campagne["alertLevel"]) {

                case 0: // Succès
                    if (campagne["finished"] == 1) {
                        state_ico = "success_status";
                    }
                    break;

                case 1: // Danger
                    state_desc += ` Contient un/des avertissement(s).`;
                    state_ico = "warn_status";
                    break;

                case 2: // Erreur critique
                    state = "error";
                    state_desc = `La campagne de mesure à rencontrer une erreur irrécupérable.`;
                    state_ico = "error_status";
                    break;
                
                default:
                    break;
            }

            campagnesContainerHTML += `
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

        campagnesContainer.innerHTML = campagnesContainerHTML;
    }

    const loading = document.getElementById("loading_div");
    if (loading != null) {
        loading.remove();
    }
}

async function filterCampagnes() {
    const name = document.getElementById("campaign_name_search_bar").value;
    const date = document.getElementById("campaign_date");
    const time = document.getElementById("campaign_time");
    const processing = document.getElementById("processing").checked;

    if (date.validity.badInput === true) {
        hideLoading();
        displayError("Impossible de trier les campagnes", "La date cible n'a pas été renseigné ou son format est incorrecte. Veuillez renseigner une date puis réessayez.");
        return;
    }
    if (time.validity.badInput === true) {
        hideLoading();
        displayError("Impossible de trier les campagnes", "L'heure cible n'a pas été renseigné ou son format est incorrecte. Veuillez renseigner une heure puis réessayez.");
        return;
    }

    closePopup("filter-popup");

    getCampagnes({"name": name.toLowerCase(), "date": date.value, "time": time.value, "processing": processing});
}

const MEASUREMENTS_SIZE_PER_HOUR = 1497.6; // In KB
const MEASUREMENTS_SIZE_PER_LINE = 0.46; // In KB
let used = 0; // In KB
let total = 0; // In KB

async function getStorageCapacity() {
    const usedStorageBar = document.getElementById("used_storage_bar");
    const storageTxt = document.getElementById("storage_txt");

    storageTxt.innerHTML = "Calcul...";
    usedStorageBar.style.width = "0%";

    let data = await NODERED_get("/storage");
    if (data != null){
        used = data["used"];
        total = data["total"];

        usage_percent = (used / total) * 100;
        let remaining_hours = (total - used) / MEASUREMENTS_SIZE_PER_HOUR;

        storageTxt.innerHTML = Math.round(usage_percent) + "% utilisé(s) • " + Math.round(remaining_hours) + "h restantes";
        usedStorageBar.style.width = usage_percent + "%";
    }
}

async function predictStoreUsage() {
    const useStorageBar = document.getElementById("use_storage_bar");
    let duration = document.getElementById("duration_input").value;
    const duration_unit = document.getElementById("duration_unit_combo_box").value;

    switch (duration_unit) {
        case "min":
            duration *= 60;
            break;

        case "h":
            duration *= 60*60;
            break;

        case "j":
            duration *= 60*60*24;
            break;

        default:
            break;
    }

    let interval = document.getElementById("interval_input").value;
    const interval_unit = document.getElementById("interval_unit_combo_box").value;

    switch (interval_unit) {
        case "min":
            interval *= 60;
            break;

        case "h":
            interval *= 60*60;
            break;

        case "j":
            interval *= 60*60*24;
            break;
            
        default:
            break;
    }

    const lines = Math.round(duration / interval);
    const size = lines * MEASUREMENTS_SIZE_PER_LINE;
    const percent = ((used + size) / total) * 100;
    useStorageBar.style.width = percent + "%";


    const space_taken_warning = document.getElementById("space_taken_warning");
    space_taken_warning.innerHTML = "";

    const percent_used = (size/total)*100;

    if (interval!=0 && duration!=0 && Math.round(percent_used)>=5){
        hideLoading();
        
        space_taken_warning.innerHTML = `
        <div class="warning_container">
            <div class="warning_ico"><span class="warn_ico"></span></div>
            <div class="warning_txt">Cette campagne va nécessiter un espace de stockage important (${(Math.round(percent_used))}%).</div>
        </div>
        `;
        return;
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

        const data_ = await NODERED_post("/add_campaign", {
            "id": data["id"]
        });
        if (data_ == null) {
            console.warn("ATTENTION : NodeRed n'a rien retourné");
        }
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

async function removeOldCampaign(){
    const data1 = await PHP_get("/PHP_API/get_settings.php");
    if (data1 != null){
        if (data1["autoRemove"]==true){
            const data2 = await NODERED_post("/cleaning", {
                "timeleft": data1["removeInterval"]
            });
            if (data2 == null) {
                console.warn("ATTENTION : NodeRed n'a rien retourné");
            }
        } 
    } 
}

document.addEventListener("DOMContentLoaded", () => {
    checkTime();
    removeOldCampaign();
    getCampagnes();
    getStorageCapacity();
    
});
