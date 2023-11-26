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

        var valeur=document.getElementById("conserv");
        valeur.setAttribute('value',timeData["value"]);

        var chaineDate=data['date'];
        var annee=chaineDate.substring(0,4);
        var mois=chaineDate.substring(5,7);
        var jour=chaineDate.substring(8,10);
        var heure=chaineDate.substring(11,13);
        var minute=chaineDate.substring(14,16);
        var seconde=chaineDate.substring(17);
        console.log(annee,mois,jour,heure,minute,seconde);

        var formeDate=Date(annee,mois,jour);
        //var formeTime=Time(heure,minute,seconde);

        var date=document.getElementById('dateRasp');
        var heure=document.getElementById('timeRasp');
        date.setAttribute('value',formeDate);
        //heure.setAttribute('value',formeTime);

        //date.setAttribute();

        var els = document.querySelector('#comboBoxTpsSuppr option[value="' + timeData["unit"] + '"]');
        if(els){
            els.setAttribute('selected','selected');
            //or els.selected = true;
        }

        console.log(timeData);
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
    
    var data = await PHP_post("/PHP_API/set_settings.php", {
        "removeInterval": interval,
        "autoRemove": active,
    });
    
    if(data != null){
        displaySuccess("Paramètres mis à jour !", "Les paramètres ont été mis à jour avec succès.");
    }

    document.

    hideLoading();
}




document.addEventListener("DOMContentLoaded", () => {
    getParametre();
});