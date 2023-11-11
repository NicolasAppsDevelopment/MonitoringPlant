let capacityPercent = 0;

async function getCampagnes(filter = null) {
    const campagnesContainer = document.getElementById("CM_container");
    campagnesContainer.innerHTML = `
    <div class="loading_popup" id="loading_div">
        <progress class="pure-material-progress-circular"></progress>
        <p class="loading_msg">Récupération des campagnes...</p>
    </div>
    `;

    let data = null;
    if (filter != null) {
        data = await post("/campagnes", filter);
    } else {
        data = await get("/campagnes");
    }

    if (data != null){
        const campagnesContainer = document.getElementById("CM_container");
        campagnesContainer.innerHTML = "";

        data["campagnes"].forEach(campagne => {
            const state = "";
            switch (campagne["state"]) {
                case "processing":
                    state = "processing";
                    break;
                
                default:
                    break;
            }

            campagnesContainer.innerHTML += `
                <form method="post" action="/voirReleve.php" class="CM ` + state + `" id="campagne_` + campagne["id"] + `" onclick="document.getElementById('campagne_` + campagne["id"] + `').submit();">
                    <input type="hidden" name="id" value="1">
                    <div class="title_detail_CM">
                        <p class="titre_CM">` + campagne["title"] + `</p>
                        <p class="detail_CM">` + campagne["state_desc"] + `</p>
                    </div>

                    <button type="button" id="removeCampaign" class="square_btn destructive remove small" onclick="removeCampagne('` + campagne["id"] + `');"></button>
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

    let data = await get("/storage");

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
    const duration = parseFloat(document.getElementById("duration_input").value);
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

    const interval = parseFloat(document.getElementById("interval_input").value);
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

    const volume = parseFloat(document.getElementById("volume_input").value);
    const volume_unit = document.getElementById("volume_unit_combo_box").value;
    switch (volume_unit) {
        case "cL":
            volume /= 100;
            break;
        default:
            break;
    }

    const data = await post("/addCampaign", {
        "title": title,
        "CO2_enabled": CO2_enabled,
        "O2_enabled": O2_enabled,
        "temperature_enabled": temperature_enabled,
        "luminosity_enabled": luminosity_enabled,
        "humidity_enabled": humidity_enabled,
        "duration": duration,
        "duration_unit": duration_unit, // "s", "min", "h", "j"
        "interval": interval,
        "interval_unit": interval_unit, // "s", "min", "h", "j"
        "volume": volume,
        "volume_unit": volume_unit // "mL", "cL"
    });

    if (data != null) {
        document.getElementById("id_added_campaign").value = data["id"];
        document.getElementById("add_popup_form").submit();
    }

    hideLoading();
}

async function removeCampagne(id) {
    event.stopPropagation();
    document.getElementById("campagne_" + id).remove();
    post("/removeCampaign", {"id": id});
}

document.addEventListener("DOMContentLoaded", () => {
    getCampagnes();
    getStorageCapacity();
});