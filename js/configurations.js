let refresh_delay = 5000;
let last_measure_datetime = null;
let refresh_repeat = true;

document.addEventListener("DOMContentLoaded", () => {
    checkTime();
    getListConfigurationJS();
});

async function subscribeRefresh() {
    do {
         //getListConfigurationJS();
        await delay(refresh_delay);
    } while (refresh_repeat);
}

async function getListConfigurationJS(filter = null) {
    const campagnesContainer = document.getElementById("CM_container");
    campagnesContainer.innerHTML = `
    <div class="loading_popup" id="loading_div">
        <svg class="spinner" viewBox="0 0 50 50">
            <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
        </svg>
        <p class="loading_msg">Récupération des configurations...</p>
    </div>
    `;

    let data = null;
    if (filter != null) {
        data = await PHP_post("/PHP_API/getListConfiguration.php", filter);
    } else {
        data = await PHP_get("/PHP_API/getListConfiguration.php");
    }

    if (data != null){
        const campagnesContainer = document.getElementById("CM_container");
        campagnesContainer.innerHTML = "";

        let campagnesContainerHTML = "";

        data["data"].forEach(campagne => {
            let state = "";
            let state_desc = "";
            let state_ico = "";

            campagnesContainerHTML += `
                <form method="post" action="/campaign.php" class="CM" id="campagne_${campagne["idCampaign"]}" onclick="document.getElementById('campagne_${campagne["idCampaign"]}').submit();">
                    <input type="hidden" name="id" value="${campagne["idCampaign"]}">
                    <div class="title_detail_CM">
                        <p class="titre_CM">${campagne["name"]}</p>
                    </div>

                    <button type="button" id="removeCampaign" class="square_btn destructive remove small" onclick="removeConfiguration(${campagne["idCampaign"]})"></button>
                </form>
            `;
        });

        campagnesContainer.innerHTML = campagnesContainerHTML;
    }

    subscribeRefresh();

    const loading = document.getElementById("loading_div");
    if (loading != null) {
        loading.remove();
    }
}

async function filterConfigurations() {
    const name = document.getElementById("campaign_name_search_bar").value;

    closePopup("filter-popup");

    getListConfigurationJS({"name": name.toLowerCase()});
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

    const data = await PHP_post("/PHP_API/createCampaign.php", {
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

        const data_ = await NODERED_post("/createCampaign", {
            "id": data["id"]
        });
        console.log(data_);
        if (data_ == null) {
            console.warn("ATTENTION : NodeRed n'a rien retourné");
        }
    }

    hideLoading();
}

async function removeConfiguration(id) {
    event.stopPropagation();

    if (await displayConfirm('Voulez-vous vraiment supprimer cette configuration de mesure ?', 'Cette configuration est supprimée définitivement. Cette action est irréversible.', 'Supprimer', true) == true) {
        document.getElementById("campagne_" + id).remove();
        PHP_post("/PHP_API/removeConfiguration.php", {
            "id": id
        });
    }
}

function handleKeyPressSearchBar(e){
    var key=e.keyCode || e.which;
    if (key==13){
    filterConfigurations();
    }
}