document.addEventListener("DOMContentLoaded", () => {
    getCampagne();
});

async function getCampagne() {
    displayLoading("Récupération de la campagne...");

    const id = document.getElementById("id_campagne").value;

    let data = await PHP_post("/PHP_API/get_campaign.php", {
        "id": parseInt(id)
    });

    if (data != null){
        let campaignInfo = data["campaignInfo"];
        let mesurements = data["measurements"];
        let logs = data["logs"];

        if (campaignInfo["finished"] == 1) {
            document.getElementById("stop_btn").remove();
        }

        const titleCampaign = document.getElementById("titleCampaign");
        const logsContainer = document.getElementById("logs_container");
        
        const startDate = document.getElementById("start_date");
        const reamingDuration = document.getElementById("reaming_duration");
        const duration = document.getElementById("duration");
        const interval = document.getElementById("interval");
        const volume = document.getElementById("volume");

        titleCampaign.innerHTML = campaignInfo["name"];
        startDate.innerHTML = dateToString(new Date(campaignInfo["beginDate"]), true, true);

        if (logs != null){
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

                logsContainer.innerHTML += `
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
        }

        let dateFin = new Date(campaignInfo["beginDate"]);
        dateFin.setSeconds(dateFin.getSeconds() + campaignInfo["duration"]);

        reamingDuration.innerHTML = dateToReamingString(dateFin);
        duration.innerHTML = getReadableTime(campaignInfo["duration"]);
        interval.innerHTML = getReadableTime(campaignInfo["interval_"]);
        if (campaignInfo["volume"] != null) {
            volume.innerHTML = campaignInfo["volume"] + " mL";
        } else {
            volume.innerHTML = "N/A";
        }

        const CO2_state = document.getElementById("state_CO2");
        const O2_state = document.getElementById("state_O2");
        const temp_state = document.getElementById("state_temp");
        const hum_state = document.getElementById("state_hum");
        const lum_state = document.getElementById("state_lum");
        
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
    
        const tableContent = document.getElementById("tableContent");
        tableContent.innerHTML = "";

        let date_array = [];
        let lum_array = [];
        let hum_array = [];
        let temp_array = [];
        let o2_array = [];
        let co2_array = [];

        mesurements.forEach(mesure => {
            let date = new Date(mesure["date"]);
            date = dateToString(date, false, true);
            date_array.push(date);

            let lum = mesure["luminosity"];
            if (lum == null || lum == undefined) {
                lum = "";
                lum_array.push(null);
            } else {
                lum += " Lm";
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
                co2 += " g/L";
                co2_array.push(parseFloat(co2));
            }

            tableContent.innerHTML += `
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

        lineChart(date_array, lum_array, hum_array, temp_array, o2_array, co2_array);
    }

    hideLoading();
}

async function exportCampagne() {
    displayLoading("Export de la campagne...");

    const id = parseInt(document.getElementById("id_campagne").value);
    const CO2_enabled = document.getElementById("CO2_checkbox").checked;
    const O2_enabled = document.getElementById("O2_checkbox").checked;
    const temperature_enabled = document.getElementById("temperature_checkbox").checked;
    const luminosity_enabled = document.getElementById("luminosity_checkbox").checked;
    const humidity_enabled = document.getElementById("humidity_checkbox").checked;
    
    let interval = parseInt(document.getElementById("interval_choice").value);
    const interval_unit = document.getElementById("interval_unit").value;
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
    const averaging = document.getElementById("moyennage").checked;
    const date_start = document.getElementById("datedebut_choice").value;
    const time_start = document.getElementById("heuredebut_choice").value;
    const date_end = document.getElementById("datefin_choice").value;
    const time_end = document.getElementById("heurefin_choice").value;
    const averaging = document.getElementById("volume").checked;

    const data = await PHP_postGetFile("/PHP_API/export_campaign.php", {
        "id": id,
        "CO2_enabled": CO2_enabled,
        "O2_enabled": O2_enabled,
        "temperature_enabled": temperature_enabled,
        "luminosity_enabled": luminosity_enabled,
        "humidity_enabled": humidity_enabled,
        "interval": interval,
        "averaging":averaging,
        "start_date": date_start,
        "start_time": time_start,
        "end_date": date_end,
        "end_time": time_end
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

        const id = parseInt(document.getElementById("id_campagne").value);
        const data = await NODERED_post("/stop_campaign", {
            "id": id
        });

        if (data == null) {
            console.warn("ATTENTION : NodeRed n'a rien retourné");
        }

        hideLoading();
    }
}

async function restartCampagne() {
    if (await displayConfirm('Voulez-vous vraiment redémarrer cette campagne de mesure ?', 'La relève des données sera interrompu et le données déjà enregistrées de cette campagne seront supprimées définitivement. Cette action est irréversible.', 'Redémarrer', true) == true) {
        displayLoading("Redémarrage de la campagne...");

        const id = parseInt(document.getElementById("id_campagne").value);
        const data = await NODERED_post("/stop_campaign", {
            "id": id
        });

        if (data == null) {
            console.warn("ATTENTION : NodeRed n'a rien retourné");
        }

        hideLoading();
    }
}
