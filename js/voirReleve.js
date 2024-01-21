let id = -1;
let refresh_delay = 5000;
let last_measure_datetime = null;
let last_log_datetime = null;
let rows = 0;

document.addEventListener("DOMContentLoaded", () => {
    checkTime();
    getCampagne();
});

async function delay(ms) {
    // return await for better async stack trace support in case of errors.
    return await new Promise(resolve => setTimeout(resolve, ms));
  }

async function subscribeRefresh() {
    do {
        getCampagne(true);
        await delay(refresh_delay);
    } while (refresh_repeat);
}

let refresh_repeat = true;
async function getCampagne(refresh_mode = false) {
    if (refresh_mode == false){
        displayLoading("Récupération de la campagne...");
        id = document.getElementById("id").value;
    } else {
        refresh_repeat = false;
    }

    let data = await PHP_post("/PHP_API/get_campaign.php", {
        "id": id,
        "last_log_datetime": last_log_datetime,
        "last_measure_datetime": last_measure_datetime
    });

    if (data != null){
        let campaignInfo = data["campaignInfo"];
        let mesurements = data["measurements"];
        let logs = data["logs"];

        if (last_log_datetime == null || data["last_log_datetime"] != null){
            last_log_datetime = data["last_log_datetime"];
        }
        if (last_measure_datetime == null || data["last_measure_datetime"] != null){
            last_measure_datetime = data["last_measure_datetime"];
        }

        if (refresh_mode == false){
            const titleCampaign = document.getElementById("titleCampaign");
            titleCampaign.innerHTML = campaignInfo["name"];

            const startDate = document.getElementById("start_date");
            startDate.innerHTML = dateToString(new Date(campaignInfo["beginDate"]), true, true);

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
        }

        let dateFin = new Date(campaignInfo["beginDate"]);
        dateFin.setSeconds(dateFin.getSeconds() + campaignInfo["duration"]);

        const reamingDuration = document.getElementById("reaming_duration");
        reamingDuration.innerHTML = dateToReamingString(dateFin);

        const logsContainer = document.getElementById("logs_container");
        if (logs != null){
            let logsContainerHTML = "";

            logs.forEach(log => {
                let icon_name = "";
                switch (log["state"]) {
                    case 0: // En cours
                        icon_name = "working_status";
                        break;
                        
                    case 1: // Terminé
                        icon_name = "success_status";
                        break;

                    case 2: // Erreur
                        icon_name = "error_status";
                        break;

                    case 3: // Danger
                        icon_name = "warn_status";
                        break;

                    default:
                        break;
                }

                logsContainerHTML += `
                <div class="status-row">
                    <div class="status-title">
                        <img style="width: 16px;" class="status-icon" src="./img/${icon_name}.svg">
                        ${log["title"]}
                    </div>
                    <span class="status-message">
                        <strong>${log["occuredDate"]}</strong> : ${log["message"]}
                    </span>
                </div>
                `;
            });
            
            if (refresh_mode == true) {
                logsContainer.innerHTML += logsContainerHTML;
            } else {
                logsContainer.innerHTML = logsContainerHTML;
            }
            
        }

        const CO2_state = document.getElementById("state_CO2");        
        switch (campaignInfo["CO2SensorState"]) {
            case 0:
                CO2_state.classList.add("unselected");
                break;
            case 1:
                CO2_state.classList.add("ok");
                break;

            case 2:
                CO2_state.classList.add("error");
                break;

            default:
                break;
        }

        const O2_state = document.getElementById("state_O2");
        switch (campaignInfo["O2SensorState"]) {
            case 0:
                O2_state.classList.add("unselected");
                break;
            case 1:
                O2_state.classList.add("ok");
                break;

            case 2:
                O2_state.classList.add("error");
                break;
            
            default:
                break;
        }

        const temp_state = document.getElementById("state_temp");
        switch (campaignInfo["temperatureSensorState"]) {
            case 0:
                temp_state.classList.add("unselected");
                break;
            case 1:
                temp_state.classList.add("ok");
                break;

            case 2:
                temp_state.classList.add("error");
                break;
            
            default:
                break;
        }

        const hum_state = document.getElementById("state_hum");
        switch (campaignInfo["humiditySensorState"]) {
            case 0:
                hum_state.classList.add("unselected");
                break;
            case 1:
                hum_state.classList.add("ok");
                break;

            case 2:
                hum_state.classList.add("error");
                break;
            
            default:
                break;
        }

        const lum_state = document.getElementById("state_lum");
        switch (campaignInfo["luminositySensorState"]) {
            case 0:
                lum_state.classList.add("unselected");
                break;
            case 1:
                lum_state.classList.add("ok");
                break;

            case 2:
                lum_state.classList.add("error");
                break;
            
            default:
                break;
        }
    
        let date_array = [];
        let lum_array = [];
        let hum_array = [];
        let temp_array = [];
        let o2_array = [];
        let co2_array = [];

        rows += mesurements.length;
        refresh_delay = 5000 + rows;

        const tableContent = document.getElementById("tableContent");
        let tableContentHTML = "";

        mesurements.forEach(mesure => {
            let date = new Date(mesure["date"]);
            date = dateToString(date, false, true);
            date_array.push(date);

            let lum = mesure["luminosity"];
            if (lum == null || lum == undefined) {
                lum = "";
                lum_array.push(null);
            } else {
                lum += " %";
                lum_array.push(parseFloat(lum));
            }

            let hum = mesure["humidity"];
            if (hum == null || hum == undefined) {
                hum = "";
                hum_array.push(null);
            } else {
                hum += " %";
                hum_array.push(parseFloat(hum));
            }

            let temp = mesure["temperature"];
            if (temp == null || temp == undefined) {
                temp = "";
                temp_array.push(null);
            } else {
                temp += " °C";
                temp_array.push(parseFloat(temp));
            }

            let o2 = mesure["O2"];
            if (o2 == null || o2 == undefined) {
                o2 = "";
                o2_array.push(null);
            } else {
                o2 += " mg/L";
                o2_array.push(parseFloat(o2));
            }

            let co2 = mesure["CO2"];
            if (co2 == null || co2 == undefined) {
                co2 = "";
                co2_array.push(null);
            } else {
                co2 += " vol%";
                co2_array.push(parseFloat(co2));
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

        if (refresh_mode == true) {
            if (rows <= 1000) {
                if (tableContentHTML != "") {
                    tableContent.innerHTML += tableContentHTML;
                }
            } else {
                document.getElementById("refreshTableDisabled").style.display = "flex";
            } 
            
            addValuesChart(date_array, lum_array, hum_array, temp_array, o2_array, co2_array);
        } else {
            tableContent.innerHTML = tableContentHTML;
            initChart(date_array, lum_array, hum_array, temp_array, o2_array, co2_array);
        } 

        if (campaignInfo["finished"] == 1) {
            document.getElementById("stop_btn").remove();
            if (refresh_mode == true){
                return;
            } 
        } else {
            if (refresh_mode == false){
                subscribeRefresh()
            } 
        }

        if (refresh_mode == true) {
            refresh_repeat = true;
        }
    }
    
    if (refresh_mode == false) {
        hideLoading();
    }
}

async function exportCampagne() {
    displayLoading("Export de la campagne...");

    const id = document.getElementById("id").value;
    const CO2_enabled = document.getElementById("CO2_checkbox").checked;
    const O2_enabled = document.getElementById("O2_checkbox").checked;
    const temperature_enabled = document.getElementById("temperature_checkbox").checked;
    const luminosity_enabled = document.getElementById("luminosity_checkbox").checked;
    const humidity_enabled = document.getElementById("humidity_checkbox").checked;
    
    const interval = document.getElementById("interval_choice");
    const interval_unit = document.getElementById("interval_unit").value;
    const averaging = document.getElementById("moyennage").checked;
    const date_start = document.getElementById("datedebut_choice");
    const time_start = document.getElementById("heuredebut_choice");
    const date_end = document.getElementById("datefin_choice");
    const time_end = document.getElementById("heurefin_choice");
    const volume = document.getElementById("calc_volume").checked;

    if (interval.validity.badInput === true) {
        hideLoading();
        displayError("Impossible d'exporter la campagne", "Le format de l'interval de récupération des mesures de la campagne est incorrecte. Veuillez renseigner un interval puis réessayez.");
        return;
    }

    if (date_start.validity.badInput === true) {
        hideLoading();
        displayError("Impossible d'exporter la campagne", "Le format de la date de début est incorrecte. Veuillez renseigner une date puis réessayez.");
        return;
    }

    if (time_start.validity.badInput === true) {
        hideLoading();
        displayError("Impossible d'exporter la campagne", "Le format de l'heure de début est incorrecte. Veuillez renseigner une heure puis réessayez.");
        return;
    }

    if (date_end.validity.badInput === true) {
        hideLoading();
        displayError("Impossible d'exporter la campagne", "Le format de la date de fin est incorrecte. Veuillez renseigner une date puis réessayez.");
        return;
    }

    if (time_end.validity.badInput === true) {
        hideLoading();
        displayError("Impossible d'exporter la campagne", "Le format de l'heure de fin est incorrecte. Veuillez renseigner une heure puis réessayez.");
        return;
    }


    const data = await PHP_postGetFile("/PHP_API/export_campaign.php", {
        "id": id,
        "CO2_enabled": CO2_enabled,
        "O2_enabled": O2_enabled,
        "temperature_enabled": temperature_enabled,
        "luminosity_enabled": luminosity_enabled,
        "humidity_enabled": humidity_enabled,
        "interval": interval.value,
        "interval_unit": interval_unit,
        "averaging":averaging,
        "start_date": date_start.value,
        "start_time": time_start.value,
        "end_date": date_end.value,
        "end_time": time_end.value,
        "volume": volume
    });

    if (data != null) {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(data);
        link.download = "mesures_" + id + ".csv"; // Provide filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        closePopup("export-popup");
        displaySuccess("Données de mesure exportées !", "Les données de mesure ont été exportées avec succès. Vous pouvez les retrouver dans le dossier \"Téléchargement\" de votre appareil.");
    }

    hideLoading();
}

async function stopCampagne() {
    if (await displayConfirm('Voulez-vous vraiment arrêter cette campagne de mesure ?', 'La relève des données sera interrompu définitivement. Cette action est irréversible.', 'Arrêter', true) == true) {
        displayLoading("Arrêt de la campagne...");

        const id = document.getElementById("id").value;
        const data = await NODERED_post("/stop_campaign", {
            "id": id
        });

        if (data == null) {
            console.warn("ATTENTION : NodeRed n'a rien retourné");
        } else {
            document.getElementById("refresh_form").submit();
        }

        hideLoading();
    }
}

async function restartCampagne() {
    if (await displayConfirm('Voulez-vous vraiment redémarrer cette campagne de mesure ?', 'La relève des données sera interrompu et le données déjà enregistrées de cette campagne seront supprimées définitivement. Cette action est irréversible.', 'Redémarrer', true) == true) {
        displayLoading("Redémarrage de la campagne...");

        const id = document.getElementById("id").value;
        const data1 = await PHP_post("/PHP_API/restart_campaign.php", {
            "id": id
        });

        if (data1 != null){
            const data2 = await NODERED_post("/redo_campaign", {
                "id": id
            });

            if (data2 == null) {
                console.warn("ATTENTION : NodeRed n'a rien retourné");
            } else {
                document.getElementById("refresh_form").submit();
            } 
        }

        hideLoading();
    }
}
