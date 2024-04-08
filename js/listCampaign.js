let currentFilter = null;
let refreshRepeat = true;

let checkboxProcessing;
let checkboxSuccess;
let checkboxError;
let checkboxWarn;

let adminMode = false;

document.addEventListener("DOMContentLoaded", () => {
    adminMode = document.getElementById("isAdmin").value == "true";

    checkTime();
    getListCampaignJS();
    getStorageCapacity();
    getConfigurations();

    checkboxProcessing = document.getElementById("processing");
    checkboxSuccess = document.getElementById("success");
    checkboxError = document.getElementById("error");
    checkboxWarn = document.getElementById("warn");

    // Listen for changes in the filter checkboxes to prevent user from selecting multiple filters at the same time.
    checkboxProcessing.addEventListener('change', function() {
        if (this.checked) {
            checkboxSuccess.checked=false;
            checkboxError.checked=false;
            checkboxWarn.checked=false;
        }
    });
    checkboxSuccess.addEventListener('change', function() {
        if (this.checked) {
            checkboxProcessing.checked=false;
            checkboxError.checked=false;
            checkboxWarn.checked=false;
        }
    });
    checkboxError.addEventListener('change', function() {
        if (this.checked) {
            checkboxSuccess.checked=false;
            checkboxProcessing.checked=false;
            checkboxWarn.checked=false;
        }
    });
    checkboxWarn.addEventListener('change', function() {
        if (this.checked) {
            checkboxSuccess.checked=false;
            checkboxError.checked=false;
            checkboxProcessing.checked=false;
        }
    });
});

/**
 * Automatic refresh of the list of measurement campaigns.
 */
async function subscribeRefresh() {
    do {
        if (refreshRepeat) {
            getListCampaignJS(currentFilter, true);
        }
        await delay(10000);
    } while (refreshRepeat);
}

/**
 * Sends a request to the server to get all measurement campaigns according to their current filter and display it.
 * @param {any} filter Filter to apply to the list of measurement campaigns {name, startDate, startTime, endDate, endTime, processing, success, error, warn}
 * @param {boolean} refreshMode Influences the visual aspect of the recovery
 */
async function getListCampaignJS(filter = null, refreshMode = false) {
    currentFilter = filter;
    const campagnesContainer = document.getElementById("CM_container");
    if (!refreshMode){
        campagnesContainer.innerHTML = `
        <div class="loading_popup" id="loading_div">
            <svg class="spinner" viewBox="0 0 50 50">
                <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
            </svg>
            <p class="loading_msg">Récupération des campagnes...</p>
        </div>
        `;
    }

    let data = null;
    if (currentFilter != null) {
        //Recovery of measurement campaigns according to the current filter.
        data = await phpPost("phpApi/getListCampaign.php", currentFilter);
    } else {
        //Recovery of all measurement campaigns.
        data = await phpGet("phpApi/getListCampaign.php");
    }

    if (data != null){
        let campagnesContainerHTML = "";

        data.forEach(campagne => {
            let state = "";
            let stateDescription = "";
            let stateIcon = "";
            
            if (campagne["finished"] == 0) {
                state = "processing";
                stateDescription = `En cours (reste ${dateToRemainingString(new Date(campagne["endingDate"]))})...`;
                stateIcon = "working_status";
            } else {
                stateDescription = `Terminé le ${dateToString(new Date(campagne["endingDate"]))}.`;
            }

            switch (campagne["alertLevel"]) {

                case 0: // Succès
                    if (campagne["finished"] == 1) {
                        stateIcon = "success_status";
                    }
                    break;

                case 1: // Danger
                    stateDescription += ` Contient un/des avertissement(s).`;
                    stateIcon = "warn_status";
                    break;

                case 2: // Erreur critique
                    state = "error";
                    stateDescription = `La campagne de mesure à rencontrer une erreur irrécupérable.`;
                    stateIcon = "error_status";
                    break;
                
                default:
                    break;
            }

            campagnesContainerHTML += `
                <form method="post" action="/campaign.php" class="CM ${state}" id="campagne_${campagne["idCampaign"]}" onclick="document.getElementById('campagne_${campagne["idCampaign"]}').submit();">
                    <input type="hidden" name="id" value="${campagne["idCampaign"]}">
                    <div class="title_detail_CM">
                        <p class="titre_CM">${campagne["name"]}</p>
                        <p class="detail_CM">
                            <img class="etat_CM" src="./img/${stateIcon}.svg">
                            ${stateDescription}
                        </p>
                    </div>
                    ${adminMode ? `<button type="button" id="removeCampaign" class="square_btn destructive remove small" onclick="tryRemoveCampaign(${campagne["idCampaign"]}, event)"></button>` : ``}
                </form>
            `;
        });

        campagnesContainer.innerHTML = campagnesContainerHTML;

        if (refreshMode) {
            refreshRepeat = true;
        } else {
            subscribeRefresh();
        }
    } else {
        refreshRepeat = false;
    }

    const loading = document.getElementById("loading_div");
    if (loading != null) {
        loading.remove();
    }
}

/**
 * Builds the filter parameters and execute the filter function.
 */
async function filterCampaigns() {
    const name = document.getElementById("campaign_name_search_bar").value;
    const startDate = document.getElementById("datedebut_choice");
    const startTime = document.getElementById("heuredebut_choice");
    const endDate = document.getElementById("datefin_choice");
    const endTime = document.getElementById("heurefin_choice");
    const processing = document.getElementById("processing").checked;
    const success = document.getElementById("success").checked;
    const error = document.getElementById("error").checked;
    const warn = document.getElementById("warn").checked;

    if (startDate.validity.badInput === true) {
        hideLoading();
        displayError("Impossible de trier les campagnes", "La date de début n'a pas été renseigné ou son format est incorrecte. Veuillez renseigner une date puis réessayez.");
        return;
    }
    if (startTime.validity.badInput === true) {
        hideLoading();
        displayError("Impossible de trier les campagnes", "L'heure de début n'a pas été renseigné ou son format est incorrecte. Veuillez renseigner une heure puis réessayez.");
        return;
    }

    if (endDate.validity.badInput === true) {
        hideLoading();
        displayError("Impossible de trier les campagnes", "La date de début n'a pas été renseigné ou son format est incorrecte. Veuillez renseigner une date puis réessayez.");
        return;
    }
    if (endTime.validity.badInput === true) {
        hideLoading();
        displayError("Impossible de trier les campagnes", "L'heure de début n'a pas été renseigné ou son format est incorrecte. Veuillez renseigner une heure puis réessayez.");
        return;
    }

    closePopup("filter-popup");

    if (!name && !startDate.value && !startTime.value && !endDate.value && !endTime.value && !processing && !success && !error && !warn){
        getListCampaignJS();
    }else{
        getListCampaignJS({"name": name.toLowerCase(), "startDate": startDate.value, "startTime": startTime.value, "endDate": endDate.value, "endTime": endTime.value, "processing": processing, "success": success, "error": error, "warn": warn});
    }
}
    

/**
 * Resets all filter parameters
 */
async function resetFilter() {
    let name = document.getElementById("campaign_name_search_bar");
    let startDate = document.getElementById("datedebut_choice");
    let startTime = document.getElementById("heuredebut_choice");
    let endDate = document.getElementById("datefin_choice");
    let endTime = document.getElementById("heurefin_choice");
    let processing = document.getElementById("processing");
    let success = document.getElementById("success");
    let error = document.getElementById("error");
    let warn = document.getElementById("warn");

    name.value='';
    startDate.value='';
    startTime.value='';
    endDate.value='';
    endTime.value='';
    processing.checked=false;
    success.checked=false;
    error.checked=false;
    warn.checked=false;

    window.location.reload();
} 

const MEASUREMENTS_SIZE_PER_HOUR = 1497.6; // In KB
const MEASUREMENTS_SIZE_PER_LINE = 0.46; // In KB
let used = 0; // In KB
let total = 0; // In KB

/**
 * Recovering raspberry pi storage capacity and displaying it.
 */
async function getStorageCapacity() {
    const usedStorageBar = document.getElementById("used_storage_bar");
    const storageTxt = document.getElementById("storage_txt");

    storageTxt.innerHTML = "Calcul...";
    usedStorageBar.style.width = "0%";

    let data = await nodeJsGet("storage");
    if (data != null){
        used = data["used"];
        total = data["total"];

        let usagePercent = (used / total) * 100;
        let remainingHours = data["maxHours"];

        storageTxt.innerHTML = Math.round(usagePercent) + "% utilisé(s) • " + Math.round(remainingHours) + "h restantes";
        usedStorageBar.style.width = usagePercent + "%";
    }
}

/**
 * Predicts and displays the storage that will be used by the new measurement campaign.
 */
async function predictStoreUsage() {
    const useStorageBar = document.getElementById("use_storage_bar");
    let duration = document.getElementById("duration_input").value;
    const durationUnit = document.getElementById("duration_unit_combo_box").value;

    switch (durationUnit) {
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
    const intervalUnit = document.getElementById("interval_unit_combo_box").value;

    switch (intervalUnit) {
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

    const spaceTakenWarning = document.getElementById("space_taken_warning");
    spaceTakenWarning.innerHTML = "";

    const percentUsed = (size / total) * 100;

    if (interval!=0 && duration!=0 && Math.round(percentUsed)>=5){
        hideLoading();
        
        spaceTakenWarning.innerHTML = `
        <div class="warning_container">
            <div class="warning_ico"><span class="warn_ico"></span></div>
            <div class="warning_txt">Cette campagne va nécessiter un espace de stockage important (${(Math.round(percentUsed))}%).</div>
        </div>
        `;
    }
}

/**
 * Recovers all input settings for the new measurement campaign and send them to the server to create it.
 */
async function addCampaign() {
    displayLoading("Ajout de la campagne...");

    //Recovery of all the new measurement campaign settings.
    const title = document.getElementById("name_input");
    const co2Enabled = document.getElementById("CO2_checkbox");
    const o2Enabled = document.getElementById("O2_checkbox");
    const temperatureEnabled = document.getElementById("temperature_checkbox");
    const luminosityEnabled = document.getElementById("luminosity_checkbox");
    const humidityEnabled = document.getElementById("humidity_checkbox");
    const duration = document.getElementById("duration_input");
    const durationUnit = document.getElementById("duration_unit_combo_box");
    const interval = document.getElementById("interval_input");
    const intervalUnit = document.getElementById("interval_unit_combo_box");
    const volume = document.getElementById("volume_input");
    const volumeUnit = document.getElementById("volume_unit_combo_box");
    const config = document.getElementById("config_combo_box");
    const humidMode = document.getElementById("humid_mode");
    const enableFiboxTemp = document.getElementById("enable_fibox_temp");


    // Checking the new measurement campaign settings.
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
    

    // Creation of the new measurement campaign.
    const data = await phpPost("phpApi/createCampaign.php", {
        "title": title.value,
        "co2Enabled": co2Enabled.checked,
        "o2Enabled": o2Enabled.checked,
        "temperatureEnabled": temperatureEnabled.checked,
        "luminosityEnabled": luminosityEnabled.checked,
        "humidityEnabled": humidityEnabled.checked,
        "duration": duration.value,
        "durationUnit": durationUnit.value,
        "interval": interval.value,
        "intervalUnit": intervalUnit.value,
        "volume": volume.value,
        "volumeUnit": volumeUnit.value,
        "configId": config.value,
        "humidMode": humidMode.checked,
        "enableFiboxTemp": enableFiboxTemp.checked
    });

    if (data != null) {
        document.getElementById("id_added_campaign").value = data["id"];
        document.getElementById("add_popup_form").submit();
    }

    hideLoading();
}

/**
 * Sends a request to the server to delete the campaign with a specific id after a confirmation from the user.
 * @param {Number} id id of the campaing that we want to remove
 * @param {Event} e event when the users press the button
 */
async function tryRemoveCampaign(id, e) {
    e.stopPropagation();

    if (await displayConfirm('Voulez-vous vraiment supprimer cette campagne de mesure ?', 'Cette campagne et ses mesures seront supprimées définitivement. Cette action est irréversible.', 'Supprimer', true)) {
        document.getElementById("campagne_" + id).remove();
        //Deletes all data of the campaign whose id is entered as a parameter.
        phpPost("phpApi/removeCampaign.php", {
            "id": id
        });
    }
}

/**
 * Filters all measurement campaigns when the user presses the "enter" key in the search bar.
 * @param {Event} e event when the users press a key
 */
function handleKeyPressSearchBar(e){
    let key=e.keyCode || e.which;
    if (key==13){
    filterCampaigns();
    }
}

/**
 * Recovery of all configurations and load them in the combo box.
 */
async function getConfigurations() {
    let data = await phpGet("phpApi/getListConfiguration.php");
    if (data != null){
        const select = document.getElementById("config_combo_box");
        data.forEach(configuration => {
            const option = document.createElement("option");
            option.value = configuration["idConfig"];
            option.innerHTML = configuration["name"];
            select.appendChild(option);
        });
    }
}