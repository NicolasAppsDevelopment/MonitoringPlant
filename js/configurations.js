async function addConfiguration() {
    displayLoading("Ajout de la configuration...");

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
    const calib_is_humid = document.getElementById("calib_is_humid");

    if (name.validity.badInput === true) {
        hideLoading();
        displayError("Impossible d'ajouter la configuration", "Le nom de la configuration n'a pas été renseigné. Veuillez renseigner un nom puis réessayez.");
        return;
    }
    
    if (f1.validity.badInput === true) {
        hideLoading();
        displayError("Impossible d'ajouter la configuration", "La valeur de f1 n'est pas valide. Veuillez renseigner une valeur valide puis réessayez.");
        return;
    }

    if (m.validity.badInput === true) {
        hideLoading();
        displayError("Impossible d'ajouter la configuration", "La valeur de m n'est pas valide. Veuillez renseigner une valeur valide puis réessayez.");
        return;
    }

    if (dPhi1.validity.badInput === true) {
        hideLoading();
        displayError("Impossible d'ajouter la configuration", "La valeur de dPhi1 n'est pas valide. Veuillez renseigner une valeur valide puis réessayez.");
        return;
    }

    if (dPhi2.validity.badInput === true) {
        hideLoading();
        displayError("Impossible d'ajouter la configuration", "La valeur de dPhi2 n'est pas valide. Veuillez renseigner une valeur valide puis réessayez.");
        return;
    }

    if (dKSV1.validity.badInput === true) {
        hideLoading();
        displayError("Impossible d'ajouter la configuration", "La valeur de dKSV1 n'est pas valide. Veuillez renseigner une valeur valide puis réessayez.");
        return;
    }

    if (dKSV2.validity.badInput === true) {
        hideLoading();
        displayError("Impossible d'ajouter la configuration", "La valeur de dKSV2 n'est pas valide. Veuillez renseigner une valeur valide puis réessayez.");
        return;
    }

    if (cal0.validity.badInput === true) {
        hideLoading();
        displayError("Impossible d'ajouter la configuration", "La valeur de cal0 n'est pas valide. Veuillez renseigner une valeur valide puis réessayez.");
        return;
    }

    if (cal2nd.validity.badInput === true) {
        hideLoading();
        displayError("Impossible d'ajouter la configuration", "La valeur de cal2nd n'est pas valide. Veuillez renseigner une valeur valide puis réessayez.");
        return;
    }

    if (t0.validity.badInput === true) {
        hideLoading();
        displayError("Impossible d'ajouter la configuration", "La valeur de t0 n'est pas valide. Veuillez renseigner une valeur valide puis réessayez.");
        return;
    }

    if (t2nd.validity.badInput === true) {
        hideLoading();
        displayError("Impossible d'ajouter la configuration", "La valeur de t2nd n'est pas valide. Veuillez renseigner une valeur valide puis réessayez.");
        return;
    }

    if (pressure.validity.badInput === true) {
        hideLoading();
        displayError("Impossible d'ajouter la configuration", "La valeur de pressure n'est pas valide. Veuillez renseigner une valeur valide puis réessayez.");
        return;
    }

    if (o2cal2nd.validity.badInput === true) {
        hideLoading();
        displayError("Impossible d'ajouter la configuration", "La valeur de o2cal2nd n'est pas valide. Veuillez renseigner une valeur valide puis réessayez.");
        return;
    }

    if (altitude.validity.badInput === true) {
        hideLoading();
        displayError("Impossible d'ajouter la configuration", "La valeur de altitude n'est pas valide. Veuillez renseigner une valeur valide puis réessayez.");
        return;
    }

    const data = await PHP_post("/PHP_API/createConfiguration.php", {
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
        "calib_is_humid": calib_is_humid.checked
    });

    if (data != null) {
        hideLoading();
        displaySuccess("Configuration ajoutée", "La configuration a bien été ajoutée.");
        location.reload();
    }

    hideLoading();
}

async function filterCampagnes() {
    const name = document.getElementById("config_name_search_bar").value;
    closePopup("filter-popup");
    getListCampaignJS({"name": name.toLowerCase()});
}

function handleKeyPressSearchBar(e){
    var key=e.keyCode || e.which;
    if (key==13){
    filterCampagnes();
    }
}

