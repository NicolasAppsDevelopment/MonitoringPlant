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

        titleCampaign.innerHTML = campaignInfo["nom"];
        startDate.innerHTML = dateToString(new Date(campaignInfo["dateDebut"]), true, true);

        let dateFin = new Date(campaignInfo["dateDebut"]);
        dateFin.setSeconds(dateFin.getSeconds() + campaignInfo["duree"]);

        reamingDuration.innerHTML = dateToReamingString(dateFin);
        duration.innerHTML = campaignInfo["duree"] + " s";
        interval.innerHTML = campaignInfo["intervalReleve"] + " s";
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
        
        switch (campaignInfo["capteurCO2"]) {
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

        switch (campaignInfo["capteurO2"]) {
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

        switch (campaignInfo["capteurTemperature"]) {
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

        switch (campaignInfo["capteurHumidite"]) {
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

        switch (campaignInfo["capteurLumiere"]) {
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
            let date = new Date(mesure["DateHeure"]);
            date = dateToString(date, false, true);
            date_array.push(date);

            let lum = mesure["Luminosite"];
            if (lum == null || lum == undefined) {
                lum = "";
                lum_array.push(null);
            } else {
                lum += " Lm";
                lum_array.push(parseFloat(lum));
            }

            let hum = mesure["Humidite"];
            if (hum == null || hum == undefined) {
                hum = "";
                hum_array.push(null);
            } else {
                hum += " %";
                hum_array.push(parseFloat(hum));
            }

            let temp = mesure["Temperature"];
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