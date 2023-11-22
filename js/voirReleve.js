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

        console.log(data);

        const titleCampaign = document.getElementById("titleCampaign");
        const startDate = document.getElementById("start_date");
        const reamingDuration = document.getElementById("reaming_duration");
        const duration = document.getElementById("duration");
        const interval = document.getElementById("interval");
        const volume = document.getElementById("volume");

        titleCampaign.innerHTML = campaignInfo["name"];
        startDate.innerHTML = dateToString(new Date(campaignInfo["beginDate"]), true, true);

        let dateFin = new Date(campaignInfo["beginDate"]);
        dateFin.setSeconds(dateFin.getSeconds() + campaignInfo["duration"]);

        reamingDuration.innerHTML = dateToReamingString(dateFin);
        duration.innerHTML = campaignInfo["duration"] + " s";
        interval.innerHTML = campaignInfo["interval_"] + " s";
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

    const date_start = document.getElementById("datedebut_choice").value;
    const hour_start = document.getElementById("heuredebut_choice").value;
    const start = String(date_start+" "+hour_start);
    let ms = Date.parse('2012-01-26T13:51:50.417-07:00');


    const date_end = document.getElementById("datefin_choice").value;
    const hour_end = document.getElementById("heurefin_choice").value;
    const end = String(date_end+" "+hour_end);

    const data = await PHP_post("/PHP_API/export_campaign.php", {
        "id": id,
        "CO2_enabled": CO2_enabled,
        "O2_enabled": O2_enabled,
        "temperature_enabled": temperature_enabled,
        "luminosity_enabled": luminosity_enabled,
        "humidity_enabled": humidity_enabled,
        "start": start,
        "end": end,
    });
    console.log(data);
    if (data != null) {
        //close la popup
        document.getElementById("btn_dwld").submit();
    }

    hideLoading();
}
