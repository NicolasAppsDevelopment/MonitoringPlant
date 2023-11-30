async function getParametre()
{
    displayLoading("Récupération des paramètres...");

    var data = await PHP_get("/PHP_API/get_settings.php");
    if (data != null){
        if (data["autoRemove"]){
            document.getElementById("auto_suppr").checked=true;
        }else{
            document.getElementById("auto_suppr").checked=false;
        }
        
        const timeData = getReadableTimeAndUnit(data["removeInterval"]);
        let valeur = document.getElementById("conserv");
        valeur.setAttribute('value',timeData["value"]);

        const datetime = dateToStandardString(data['date']);

        let date = document.getElementById('dateRasp');
        let time = document.getElementById('timeRasp');
        date.value = datetime["date"];
        time.value = datetime["time"];

        var els = document.querySelector('#comboBoxTpsSuppr option[value="' + timeData["unit"] + '"]');
        if(els){
            els.setAttribute('selected','selected');
            //or els.selected = true;
        }
    }

    hideLoading();
}

async function postParametre()
{
    displayLoading("Mise à jour des paramètres...");

    if (document.getElementById("auto_suppr").checked == true){
        active="1";
        interval=document.getElementById("conserv").value;
        t=document.getElementById("comboBoxTpsSuppr").value;


            if(t=="h"){
                interval *= 3600;
            }if(t=="j"){
                interval *= 86400;
            }if(t=="mois"){
                interval *= 2592000;
            }
    } else {
        active="0";
        interval="0";
    }
    date=document.getElementById("dateRasp").value;
    time=document.getElementById("timeRasp").value;

    var data = await PHP_post("/PHP_API/set_settings.php", {
        "removeInterval": interval,
        "autoRemove": active,
        "date":date,
        "time":time,
    });
    
    if(data != null){
        displaySuccess("Paramètres mis à jour !", "Les paramètres ont été mis à jour avec succès.");
    }



    hideLoading();
}

async function postDeleteAll()
{
    if (await displayConfirm('Voulez-vous vraiment supprimer toutes les données de cet appareil ?', 'Toutes les campagnes, mesures et paramètres seront supprimées définitivement. Cette action est irréversible.', 'Effacer', true) == true) {
        displayLoading("Suppression des données...");
    
        var data = await NODERED_post("/format", {
            "key": "securityKey"
        });
        
        if(data != null){
            displaySuccess("Données supprimées !", "Toutes les campagnes, mesures et paramètres ont été supprimées avec succès.");
        }

        hideLoading();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    getParametre();
});