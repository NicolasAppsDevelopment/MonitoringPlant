document.addEventListener("DOMContentLoaded", () => {
    checkTime();
    getListConfigJS();
});

/**
 * Send a request to the server to add or modify a configuration in the database.
 * @param {boolean} editMode Indicates whether the configuration is being added or modified
 * @param {Number} id Configuration id
 */
async function saveConfiguration(editMode = false, id = null) {
    let actionVerb = "d'ajouter";
    if (editMode === true) {
        displayLoading("Modification de la configuration...");
        actionVerb = "de modifier";
    } else {
        displayLoading("Ajout de la configuration...");
    }

    // Settings to register a configuration.
    const name = document.getElementById("name_input");
    const f1 = document.getElementById("f1_input");
    const m = document.getElementById("m_input");
    const dPhi1 = document.getElementById("dphi1_input");
    const dPhi2 = document.getElementById("dphi2_input");
    const dKSV1 = document.getElementById("dksv1_input");
    const dKSV2 = document.getElementById("dksv2_input");
    const cal0 = document.getElementById("cal0_input");
    const cal2nd = document.getElementById("cal2nd_input");
    const t0 = document.getElementById("t0_input");
    const t2nd = document.getElementById("t2nd_input");
    const pressure = document.getElementById("pressure_input");
    const o2cal2nd = document.getElementById("o2cal2nd_input");
    const altitude = document.getElementById("alt_input");
    const calibIsHumid = document.getElementById("calib_is_humid");

    // Checking if all configuration settings are define.
    if (name.validity.badInput === true) {
        hideLoading();
        displayError("Impossible " + actionVerb + " la configuration", "Le nom de la configuration n'a pas été renseigné. Veuillez renseigner un nom puis réessayez.");
        return;
    }
    
    if (f1.validity.badInput === true) {
        hideLoading();
        displayError("Impossible " + actionVerb + " la configuration", "La valeur de f1 n'est pas valide. Veuillez renseigner une valeur valide puis réessayez.");
        return;
    }

    if (m.validity.badInput === true) {
        hideLoading();
        displayError("Impossible " + actionVerb + " la configuration", "La valeur de m n'est pas valide. Veuillez renseigner une valeur valide puis réessayez.");
        return;
    }

    if (dPhi1.validity.badInput === true) {
        hideLoading();
        displayError("Impossible " + actionVerb + " la configuration", "La valeur de dPhi1 n'est pas valide. Veuillez renseigner une valeur valide puis réessayez.");
        return;
    }

    if (dPhi2.validity.badInput === true) {
        hideLoading();
        displayError("Impossible " + actionVerb + " la configuration", "La valeur de dPhi2 n'est pas valide. Veuillez renseigner une valeur valide puis réessayez.");
        return;
    }

    if (dKSV1.validity.badInput === true) {
        hideLoading();
        displayError("Impossible " + actionVerb + " la configuration", "La valeur de dKSV1 n'est pas valide. Veuillez renseigner une valeur valide puis réessayez.");
        return;
    }

    if (dKSV2.validity.badInput === true) {
        hideLoading();
        displayError("Impossible " + actionVerb + " la configuration", "La valeur de dKSV2 n'est pas valide. Veuillez renseigner une valeur valide puis réessayez.");
        return;
    }

    if (cal0.validity.badInput === true) {
        hideLoading();
        displayError("Impossible " + actionVerb + " la configuration", "La valeur de cal0 n'est pas valide. Veuillez renseigner une valeur valide puis réessayez.");
        return;
    }

    if (cal2nd.validity.badInput === true) {
        hideLoading();
        displayError("Impossible " + actionVerb + " la configuration", "La valeur de cal2nd n'est pas valide. Veuillez renseigner une valeur valide puis réessayez.");
        return;
    }

    if (t0.validity.badInput === true) {
        hideLoading();
        displayError("Impossible " + actionVerb + " la configuration", "La valeur de t0 n'est pas valide. Veuillez renseigner une valeur valide puis réessayez.");
        return;
    }

    if (t2nd.validity.badInput === true) {
        hideLoading();
        displayError("Impossible " + actionVerb + " la configuration", "La valeur de t2nd n'est pas valide. Veuillez renseigner une valeur valide puis réessayez.");
        return;
    }

    if (pressure.validity.badInput === true) {
        hideLoading();
        displayError("Impossible " + actionVerb + " la configuration", "La valeur de pressure n'est pas valide. Veuillez renseigner une valeur valide puis réessayez.");
        return;
    }

    if (o2cal2nd.validity.badInput === true) {
        hideLoading();
        displayError("Impossible " + actionVerb + " la configuration", "La valeur de o2cal2nd n'est pas valide. Veuillez renseigner une valeur valide puis réessayez.");
        return;
    }

    if (altitude.validity.badInput === true) {
        hideLoading();
        displayError("Impossible " + actionVerb + " la configuration", "La valeur de altitude n'est pas valide. Veuillez renseigner une valeur valide puis réessayez.");
        return;
    }

    // Register the configuration
    let data = null;
    if (editMode === true) {
        data = await phpPost("phpApi/editConfiguration.php", {
            "id": id,
            "name": name.value,
            "f1": f1.value,
            "m": m.value,
            "dPhi1": dPhi1.value,
            "dPhi2": dPhi2.value,
            "dKSV1": dKSV1.value,
            "dKSV2": dKSV2.value,
            "cal0": cal0.value,
            "cal2nd": cal2nd.value,
            "t0": t0.value,
            "t2nd": t2nd.value,
            "pressure": pressure.value,
            "o2cal2nd": o2cal2nd.value,
            "altitude": altitude.value,
            "calibIsHumid": calibIsHumid.checked
        });
    } else {
        data = await phpPost("phpApi/addConfiguration.php", {
            "name": name.value,
            "f1": f1.value,
            "m": m.value,
            "dPhi1": dPhi1.value,
            "dPhi2": dPhi2.value,
            "dKSV1": dKSV1.value,
            "dKSV2": dKSV2.value,
            "cal0": cal0.value,
            "cal2nd": cal2nd.value,
            "t0": t0.value,
            "t2nd": t2nd.value,
            "pressure": pressure.value,
            "o2cal2nd": o2cal2nd.value,
            "altitude": altitude.value,
            "calibIsHumid": calibIsHumid.checked
        });
    }

    if (data != null) {
        hideLoading();
        closePopup("add-popup");
        location.reload();
    }

    hideLoading();
}

/**
 * Recovers and diplays the configuration whose id corresponds to the parameter
 * @param {Number} id Configuration id
 */
async function loadConfiguration(id) {
    displayLoading("Récupération de la configuration...");

    document.getElementById("add-popup-title").innerText = "Modifier une configuration";
    document.getElementById("add-popup-btn").innerText = "Modifier";
    document.getElementById("add-popup-btn").setAttribute("onclick", "editConfiguration(" + id + ");");

    // Settings of the configuration.
    const name = document.getElementById("name_input");
    const f1 = document.getElementById("f1_input");
    const m = document.getElementById("m_input");
    const dPhi1 = document.getElementById("dphi1_input");
    const dPhi2 = document.getElementById("dphi2_input");
    const dKSV1 = document.getElementById("dksv1_input");
    const dKSV2 = document.getElementById("dksv2_input");
    const cal0 = document.getElementById("cal0_input");
    const cal2nd = document.getElementById("cal2nd_input");
    const t0 = document.getElementById("t0_input");
    const t2nd = document.getElementById("t2nd_input");
    const pressure = document.getElementById("pressure_input");
    const o2cal2nd = document.getElementById("o2cal2nd_input");
    const altitude = document.getElementById("alt_input");
    const calibIsHumid = document.getElementById("calib_is_humid");

    const data = await phpPost("phpApi/getConfiguration.php", {
        "id": id,
    });

    if (data != null) {
        // rename popup title to edit configuration + rename button to edit

        name.value = data["name"];
        f1.value = data["f1"];
        m.value = data["m"];
        dPhi1.value = data["dPhi1"];
        dPhi2.value = data["dPhi2"];
        dKSV1.value = data["dKSV1"];
        dKSV2.value = data["dKSV2"];
        cal0.value = data["cal0"];
        cal2nd.value = data["cal2nd"];
        t0.value = data["t0"];
        t2nd.value = data["t2nd"];
        pressure.value = data["pressure"];
        o2cal2nd.value = data["o2cal2nd"];
        altitude.value = data["altitude"];
        calibIsHumid.checked = Boolean(data["calibIsHumid"]);

        hideLoading();
        openPopup("add-popup");
        return;
    }

    hideLoading();
}

/**
 * Prepares the popup to add a configuration
 */
async function prepareAddPopup() {
    document.getElementById("add-popup-title").innerText = "Ajouter une configuration";
    document.getElementById("add-popup-btn").innerText = "Ajouter";
    document.getElementById("add-popup-btn").setAttribute("onclick", "saveConfiguration();");

    // Settings to add a configuration.
    document.getElementById("name_input").value = "";
    document.getElementById("f1_input").value = "";
    document.getElementById("m_input").value = "";
    document.getElementById("dphi1_input").value = "";
    document.getElementById("dphi2_input").value = "";
    document.getElementById("dksv1_input").value = "";
    document.getElementById("dksv2_input").value = "";
    document.getElementById("cal0_input").value = "";
    document.getElementById("cal2nd_input").value = "";
    document.getElementById("t0_input").value = "";
    document.getElementById("t2nd_input").value = "";
    document.getElementById("pressure_input").value = "";
    document.getElementById("o2cal2nd_input").value = "";
    document.getElementById("alt_input").value = "";
    document.getElementById("calib_is_humid").checked = false;
}

/**
 * Save the configuration after the user has confirmed the modification.
 * @param {Number} id Configuration id
 */
async function editConfiguration(id) {
    if (await displayConfirm('Voulez-vous vraiment modifier cette configuration de mesure ?', 'Cette configuration sera modifiée définitivement. Les campagnes ayant utilisées cette configuration veront leurs références vers cette dernière également modifié (si vous changez le nom de la configuration, ce dernier sera aussi modifié sur chaque campagne concerné). Cette action est irréversible.', 'Modifier', true)) {
        saveConfiguration(true, id);
    }
}

/**
 * Send a request to the server to remove a configuration from the database after the user has confirmed the deletion.
 * @param {Number} id Configuration id
 * @param {Event} e event when the users press the button
 */
async function removeConfig(id, e) {
    e.stopPropagation();

    if (await displayConfirm('Voulez-vous vraiment supprimer cette configuration de mesure ?', 'Cette configuration est supprimée définitivement. Les campagnes ayant utilisées cette configuration veront leurs références vers cette dernière supprimé (vous ne pourrez plus voir le nom de la configuration utilisé par la campagne concerné). Cette action est irréversible.', 'Supprimer', true)) {
        document.getElementById("config_" + id).remove();
        phpPost("phpApi/removeConfiguration.php", {
            "id": id
        });
    }
}

/**
 * Filters all configurations when the user presses the "enter" key in the search bar.
 * @param {*} e event when the users press a key
 */
function handleKeyPressSearchBar(e){
    let key=e.keyCode || e.which;
    if (key==13){
    filterConfigurations();
    }
}

/**
 * Recovers and displays all configurations based on the filter in parameter.
 * @param {any} filter Array of filters to apply to the configurations (name): {"name": "..."}
 */
async function getListConfigJS(filter = null) {
    const configurationsContainer = document.getElementById("config_container");
    configurationsContainer.innerHTML = `
    <div class="loading_popup" id="loading_div">
        <svg class="spinner" viewBox="0 0 50 50">
            <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
        </svg>
        <p class="loading_msg">Récupération des configurations...</p>
    </div>
    `;

    let data = null;
    if (filter != null) {
        data = await phpPost("phpApi/getListConfiguration.php", filter);
    } else {
        data = await phpGet("phpApi/getListConfiguration.php");
    }

    if (data != null){
        configurationsContainer.innerHTML = "";

        let configContainerHTML = "";
        data.forEach(config => {
            configContainerHTML += `
                <form class="CM" id="config_${config["idConfig"]}" onclick="loadConfiguration(${config["idConfig"]});">
                    <input type="hidden" name="id" value="${config["idConfig"]}">
                    <div class="title_detail_CM">
                        <p class="titre_CM">${config["name"]}</p>
                    </div>

                    <button type="button" id="removeConfiguration" class="square_btn destructive remove small" onclick="removeConfig(${config["idConfig"]}, event)"></button>
                </form>
            `;
        });

        configurationsContainer.innerHTML = configContainerHTML;
    }

    const loading = document.getElementById("loading_div");
    if (loading != null) {
        loading.remove();
    }
}

/**
 * Displays all configurations depending on the filter input
 */
async function filterConfigurations() {
    const name = document.getElementById("config_name_search_bar").value;
    getListConfigJS({"name": name.toLowerCase()});
}