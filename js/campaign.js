let id = -1;
let campaignName = "";
let refreshDelay = 5000;
let lastMeasureDatetime = null;
let lastLogDatetime = null;
let rows = 0;
let refreshRepeat = true;



//Executes each of the following functions when all html code is loaded.
document.addEventListener("DOMContentLoaded", () => {
    // Checks if the raspberry pi's time is the same as that of the device using the website.
    checkTime();
    // Recovers and displays measurement campaign data.
    getCampaignMeasurements();
});

/**
 * Automatic refresh of measurement campaign data.
 */
async function subscribeRefresh() {
    do {
        if (refreshRepeat) {
            // Recovery and display measurement campaign data.
            getCampaignMeasurements(true);
        }
        await delay(refreshDelay);
    } while (refreshRepeat);
}

/**
 * Recovery and display measurement campaign data.
 * @param {boolean} refreshMode Influences the visual aspect of the recovery
 */
async function getCampaignMeasurements(refreshMode = false) {
    if (!refreshMode){
        displayLoading("Récupération de la campagne...");
        id = document.getElementById("id").value;
    } else {
        refreshRepeat = false;
    }

    // Recovery measurement campaign data.
    let data = await phpPost("phpApi/getCampaign.php", {
        "id": id,
        "lastLogDatetime": lastLogDatetime,
        "lastMeasureDatetime": lastMeasureDatetime
    });

    // Displays measurement campaign data and controls access to admin functions.
    if (data != null){
        let campaignInfo = data["campaignInfo"];
        let mesurements = data["measurements"];
        let logs = data["logs"];

        if (lastLogDatetime == null || data["lastLogDatetime"] != null){
            lastLogDatetime = data["lastLogDatetime"];
        }
        if (lastMeasureDatetime == null || data["lastMeasureDatetime"] != null){
            lastMeasureDatetime = data["lastMeasureDatetime"];
        }

        if(!campaignInfo["finished"]){
            const actionBar=document.getElementById("actionBar");
            actionBar.innerHTML = `
                <button class="status-action-container restart" onclick="restartCampagne()" id="restart_btn">
                    <svg class="action-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0,0,256,256"><g transform="translate(-11.52,-11.52) scale(1.09,1.09)"><g fill="currentColor" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="none" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path transform="scale(10.66667,10.66667)" d="M9,2v7l-2.65039,-2.65039c-1.44913,1.44767 -2.34961,3.4444 -2.34961,5.65039c0,4.411 3.589,8 8,8c4.411,0 8,-3.589 8,-8c0,-4.411 -3.589,-8 -8,-8v-2c5.514,0 10,4.486 10,10c0,5.514 -4.486,10 -10,10c-5.514,0 -10,-4.486 -10,-10c0,-2.75729 1.12627,-5.25179 2.93945,-7.06055l-2.93945,-2.93945z" id="strokeMainSVG" stroke="currentColor" stroke-linejoin="round"></path><g transform="scale(10.66667,10.66667)" stroke="none" stroke-linejoin="miter"><path d="M2,2l2.93945,2.93945c-1.81318,1.80876 -2.93945,4.30325 -2.93945,7.06055c0,5.514 4.486,10 10,10c5.514,0 10,-4.486 10,-10c0,-5.514 -4.486,-10 -10,-10v2c4.411,0 8,3.589 8,8c0,4.411 -3.589,8 -8,8c-4.411,0 -8,-3.589 -8,-8c0,-2.20599 0.90048,-4.20272 2.34961,-5.65039l2.65039,2.65039v-7z"></path></g></g></g></svg>
                </button> 
                <button class="status-action-container stop" onclick="stopCampagne()" id="stop_btn">
                    <svg class="aciton-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0,0,256,256"><g transform="translate(-48.64,-48.64) scale(1.38,1.38)"><g fill="currentColor" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(5.12,5.12)"><path d="M8,8v34h34v-34z"></path></g></g></g></svg>
                </button>
            `;
        }

        if (!refreshMode){
            const titleCampaign = document.getElementById("titleCampaign");
            titleCampaign.innerHTML = campaignInfo["name"];
            campaignName = campaignInfo["name"];

            const beginDate = document.getElementById("start_date");
            beginDate.innerHTML = dateToString(new Date(campaignInfo["beginDate"]), true, true);

            const duration = document.getElementById("duration");
            duration.innerHTML = getReadableTime(campaignInfo["duration"]);

            const interval = document.getElementById("interval");
            interval.innerHTML = getReadableTime(campaignInfo["interval_"]);

            const volume = document.getElementById("volume");
            if (campaignInfo["volume"] != null) {
                volume.innerHTML = campaignInfo["volume"] + " mL";
            } else {
                volume.innerHTML = "N/A";
            }

            const configName = document.getElementById("config_name");
            configName.innerHTML = campaignInfo["nameConfig"];

            const humidMode = document.getElementById("humid_mode");
            humidMode.innerHTML = getReadableBool(campaignInfo["humidMode"]);

            const enableFiboxTemp = document.getElementById("enable_fibox_temp");
            enableFiboxTemp.innerHTML = getReadableBool(campaignInfo["enableFiboxTemp"]);
        }

        let dateFin = new Date(campaignInfo["beginDate"]);
        dateFin.setSeconds(dateFin.getSeconds() + campaignInfo["duration"]);

        const remainingDuration = document.getElementById("remaining_duration");
        remainingDuration.innerHTML = dateToRemainingString(dateFin);

        const logsContainer = document.getElementById("logs_container");
        if (logs != null){
            let logsContainerHTML = "";

            logs.forEach(log => {
                let iconName = "";
                switch (log["state"]) {
                    case 0: // En cours
                        iconName = "working_status";
                        break;
                        
                    case 1: // Terminé
                        iconName = "success_status";
                        break;

                    case 2: // Erreur
                        iconName = "error_status";
                        break;

                    case 3: // Danger
                        iconName = "warn_status";
                        break;

                    default:
                        break;
                }

                logsContainerHTML += `
                <div class="status-row">
                    <div class="status-title">
                        <img style="width: 16px;" class="status-icon" src="./img/${iconName}.svg">
                        ${log["title"]}
                    </div>
                    <span class="status-message">
                        <strong>${log["occuredDate"]}</strong> : ${log["message"]}
                    </span>
                </div>
                `;
            });
            
            if (refreshMode) {
                logsContainer.innerHTML += logsContainerHTML;
            } else {
                logsContainer.innerHTML = logsContainerHTML;
            }
            
        }

        const co2State = document.getElementById("state_CO2");        
        switch (campaignInfo["CO2SensorState"]) {
            case 0:
                co2State.classList.add("unselected");
                break;
            case 1:
                co2State.classList.add("ok");
                break;

            case 2:
                co2State.classList.add("error");
                break;

            default:
                break;
        }

        const o2State = document.getElementById("state_O2");
        switch (campaignInfo["O2SensorState"]) {
            case 0:
                o2State.classList.add("unselected");
                break;
            case 1:
                o2State.classList.add("ok");
                break;

            case 2:
                o2State.classList.add("error");
                break;
            
            default:
                break;
        }

        const tempState = document.getElementById("state_temp");
        switch (campaignInfo["temperatureSensorState"]) {
            case 0:
                tempState.classList.add("unselected");
                break;
            case 1:
                tempState.classList.add("ok");
                break;

            case 2:
                tempState.classList.add("error");
                break;
            
            default:
                break;
        }

        const humState = document.getElementById("state_hum");
        switch (campaignInfo["humiditySensorState"]) {
            case 0:
                humState.classList.add("unselected");
                break;
            case 1:
                humState.classList.add("ok");
                break;

            case 2:
                humState.classList.add("error");
                break;
            
            default:
                break;
        }

        const lumState = document.getElementById("state_lum");
        switch (campaignInfo["luminositySensorState"]) {
            case 0:
                lumState.classList.add("unselected");
                break;
            case 1:
                lumState.classList.add("ok");
                break;

            case 2:
                lumState.classList.add("error");
                break;
            
            default:
                break;
        }
    
        let dateArray = [];
        let lumArray = [];
        let humArray = [];
        let tempArray = [];
        let o2Array = [];
        let co2Array = [];

        rows += mesurements.length;
        refreshDelay = 5000 + rows;

        const tableContent = document.getElementById("tableContent");
        let tableContentHTML = "";

        mesurements.forEach(mesure => {
            let date = new Date(mesure["date"]);
            date = dateToString(date, false, true);
            dateArray.push(date);

            let lum = mesure["luminosity"];
            if (lum == null || lum == undefined) {
                lum = "";
                lumArray.push(null);
            } else {
                lum += " %";
                lumArray.push(parseFloat(lum));
            }

            let hum = mesure["humidity"];
            if (hum == null || hum == undefined) {
                hum = "";
                humArray.push(null);
            } else {
                hum += " %";
                humArray.push(parseFloat(hum));
            }

            let temp = mesure["temperature"];
            if (temp == null || temp == undefined) {
                temp = "";
                tempArray.push(null);
            } else {
                temp += " °C";
                tempArray.push(parseFloat(temp));
            }

            let o2 = mesure["O2"];
            if (o2 == null || o2 == undefined) {
                o2 = "";
                o2Array.push(null);
            } else {
                o2 += " %";
                o2Array.push(parseFloat(o2));
            }

            let co2 = mesure["CO2"];
            if (co2 == null || co2 == undefined) {
                co2 = "";
                co2Array.push(null);
            } else {
                co2 += " vol%";
                co2Array.push(parseFloat(co2));
            }

            tableContentHTML += `
                <tr>
                    <td>${date}</td>
                    <td>${lum}</td>
                    <td>${hum}</td>
                    <td>${temp}</td>
                    <td>${o2}</td>
                    <td>${co2}</td>
                </tr>
            `;
        });

        if (refreshMode) {
            if (rows <= 1000) {
                if (tableContentHTML != "") {
                    tableContent.innerHTML += tableContentHTML;
                }
            } else {
                document.getElementById("refreshTableDisabled").style.display = "flex";
            } 
            
            addValuesChart(dateArray, lumArray, humArray, tempArray, o2Array, co2Array);
        } else {
            tableContent.innerHTML = tableContentHTML;
            initChart(dateArray, lumArray, humArray, tempArray, o2Array, co2Array);
        } 

        if (campaignInfo["finished"] == 1) {
            document.getElementById("stop_btn").remove();
            if (refreshMode){
                return;
            } 
        } else if (!refreshMode){
            subscribeRefresh();
        }

        if (refreshMode) {
            refreshRepeat = true;
        }
    } else {
        refreshRepeat = false;
    }
    
    if (!refreshMode) {
        hideLoading();
    }
}

/**
 * Exports measurement campaign data.
 */
async function exportCampagne() {
    displayLoading("Export de la campagne...");

    // Settings to export measurement campaign data.
    const id = document.getElementById("id").value;
    const co2Enabled = document.getElementById("CO2_checkbox").checked;
    const o2Enabled = document.getElementById("O2_checkbox").checked;
    const temperatureEnabled = document.getElementById("temperature_checkbox").checked;
    const luminosityEnabled = document.getElementById("luminosity_checkbox").checked;
    const humidityEnabled = document.getElementById("humidity_checkbox").checked;
    
    const interval = document.getElementById("interval_choice");
    const intervalUnit = document.getElementById("intervalUnit").value;
    const averaging = document.getElementById("moyennage").checked;
    const dateStart = document.getElementById("datedebut_choice");
    const timeStart = document.getElementById("heuredebut_choice");
    const dateEnd = document.getElementById("datefin_choice");
    const timeEnd = document.getElementById("heurefin_choice");
    const volume = document.getElementById("calc_volume").checked;
    const exportConfig = document.getElementById("export_config").checked;


    // Checking export settings.
    if (interval.validity.badInput === true) {
        hideLoading();
        displayError("Impossible d'exporter la campagne", "Le format de l'interval de récupération des mesures de la campagne est incorrecte. Veuillez renseigner un interval puis réessayez.");
        return;
    }

    if (dateStart.validity.badInput === true) {
        hideLoading();
        displayError("Impossible d'exporter la campagne", "Le format de la date de début est incorrecte. Veuillez renseigner une date puis réessayez.");
        return;
    }

    if (timeStart.validity.badInput === true) {
        hideLoading();
        displayError("Impossible d'exporter la campagne", "Le format de l'heure de début est incorrecte. Veuillez renseigner une heure puis réessayez.");
        return;
    }

    if (dateEnd.validity.badInput === true) {
        hideLoading();
        displayError("Impossible d'exporter la campagne", "Le format de la date de fin est incorrecte. Veuillez renseigner une date puis réessayez.");
        return;
    }

    if (timeEnd.validity.badInput === true) {
        hideLoading();
        displayError("Impossible d'exporter la campagne", "Le format de l'heure de fin est incorrecte. Veuillez renseigner une heure puis réessayez.");
        return;
    }


    //Exports measurement campaign data.
    const success = await phpDownload(campaignName + ".csv", "phpApi/exportCampaign.php", {
        "id": id,
        "co2Enabled": co2Enabled,
        "o2Enabled": o2Enabled,
        "temperatureEnabled": temperatureEnabled,
        "luminosityEnabled": luminosityEnabled,
        "humidityEnabled": humidityEnabled,
        "interval": interval.value,
        "intervalUnit": intervalUnit,
        "averaging":averaging,
        "startDate": dateStart.value,
        "startTime": timeStart.value,
        "endDate": dateEnd.value,
        "endTime": timeEnd.value,
        "volume": volume,
        "exportConfig": exportConfig
    });

    // Creation and download of the csv file
    if (success) {
        closePopup("export-popup");
        displaySuccess("Données de mesure exportées !", "Les données de mesure ont été exportées avec succès. Vous pouvez les retrouver dans le dossier \"Téléchargement\" de votre appareil.");
    }

    hideLoading();
}

/**
 * Stop the selected measurement campaign.
 */
async function stopCampagne() {
    if (await displayConfirm('Voulez-vous vraiment arrêter cette campagne de mesure ?', 'La relève des données sera interrompu définitivement. Cette action est irréversible.', 'Arrêter', true)) {
        displayLoading("Arrêt de la campagne...");

        // Setting to stop the measurement campaign.
        const id = document.getElementById("id").value;
        const data = await phpPost("phpApi/stopCampaign.php", {
            "id": id
        });

        if (data != null) {
            document.getElementById("refresh_form").submit();
        }

        hideLoading();
    }
}

/**
 * Restart the selected measurement campaign.
 */
async function restartCampagne() {
    if (await displayConfirm('Voulez-vous vraiment redémarrer cette campagne de mesure ?', 'La relève des données sera interrompu et le données déjà enregistrées de cette campagne seront supprimées définitivement. Cette action est irréversible.', 'Redémarrer', true)) {
        displayLoading("Redémarrage de la campagne...");

        // Setting to restart the measurement campaign.
        const id = document.getElementById("id").value;
        const data = await phpPost("phpApi/restartCampaign.php", {
            "id": id
        });

        if (data != null) {
            document.getElementById("refresh_form").submit();
        } 
        

        hideLoading();
    }
}
