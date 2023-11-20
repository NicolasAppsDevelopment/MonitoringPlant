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
            let dateFin = new Date(campagne["dateDebut"]);
            dateFin.setSeconds(dateFin.getSeconds() + campagne["duree"]);
            

            switch (campagne["etat"]) {
                case 0: // En cours
                    state = "processing";
                    state_desc = `En cours (reste ${dateToReamingString(dateFin)})...`;
                    break;

                case 1: // Terminé
                    state = "";
                    state_desc = `Terminé le ${dateToString(dateFin)}.`;
                    break;
                
                default:
                    break;
            }

            campagnesContainer.innerHTML += `
                <form method="post" action="/voirReleve.php" class="CM ${state}" id="campagne_${campagne["idCampagne"]}" onclick="document.getElementById('campagne_${campagne["idCampagne"]}').submit();">
                    <input type="hidden" name="id" value="${campagne["idCampagne"]}">
                    <div class="title_detail_CM">
                        <p class="titre_CM">${campagne["nom"]}</p>
                        <p class="detail_CM">${state_desc}</p>
                    </div>

                    <button type="button" id="removeCampaign" class="square_btn destructive remove small" onclick="removeCampagne(${campagne["idCampagne"]})"></button>
                </form>
            `;
        });
    }

    document.getElementById("loading_div").remove();
}

async function filterCampagnes() {
    const date = document.getElementById("campaign_date").value;
    const time = document.getElementById("campaign_time").value;
    const processing = document.getElementById("processing").checked;

    document.getElementById("filter-popup").checked = false;

    getCampagnes({"date": date, "time": time, "processing": processing});
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

    const title = document.getElementById("name_input").value;
    const CO2_enabled = document.getElementById("CO2_checkbox").checked;
    const O2_enabled = document.getElementById("O2_checkbox").checked;
    const temperature_enabled = document.getElementById("temperature_checkbox").checked;
    const luminosity_enabled = document.getElementById("luminosity_checkbox").checked;
    const humidity_enabled = document.getElementById("humidity_checkbox").checked;
    let duration = parseInt(document.getElementById("duration_input").value);
    const duration_unit = document.getElementById("duration_unit_combo_box").value;
    switch (duration_unit) {
        case "min":
            duration *= 60;
            break;
        case "h":
            duration *= 3600;
            break;
        case "j":
            duration *= 86400;
            break;
        default:
            break;
    }

    let interval = parseInt(document.getElementById("interval_input").value);
    const interval_unit = document.getElementById("interval_unit_combo_box").value;
    switch (interval_unit) {
        case "min":
            interval *= 60;
            break;
        case "h":
            interval *= 3600;
            break;
        case "j":
            interval *= 86400;
            break;
        default:
            break;
    }

    let volume = parseFloat(document.getElementById("volume_input").value);
    const volume_unit = document.getElementById("volume_unit_combo_box").value;
    switch (volume_unit) {
        case "cL":
            volume /= 100;
            break;
        default:
            break;
    }

    const data = await PHP_post("/PHP_API/add_campaign.php", {
        "title": title,
        "CO2_enabled": CO2_enabled,
        "O2_enabled": O2_enabled,
        "temperature_enabled": temperature_enabled,
        "luminosity_enabled": luminosity_enabled,
        "humidity_enabled": humidity_enabled,
        "duration": duration, // s
        "interval": interval, // s
        "volume": volume, // cL
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

document.addEventListener("DOMContentLoaded", () => {
    getCampagnes();
    getStorageCapacity();
});