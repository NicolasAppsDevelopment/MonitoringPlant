async function getParametre()
{
    var data = await PHP_get("/PHP_API/get_settings.php");
    if (data != null){
        if (data["autoRemove"]){
            document.getElementById("auto_suppr").checked=true;
        }else{
            document.getElementById("auto_suppr").checked=false;
        }
        
        var valeur=document.getElementById("conserv");
        valeur.setAttribute('value',data["removeInterval"]);
    }
    
    //Modifier la table Parametre de la BD pour ajouter des valeurs pour : 
    //(heure, jour, mois)

}

async function postParametre()
{


    if (document.getElementById("auto_suppr").checked==true){
        $active=true;
        $tpSupression=data["removeInterval"];
    }else{
        $active=false;
        $tpSupression=0;
    }
    
    var data = await PHP_post("/PHP_API/set_settings.php", {
        
        "removeInterval":$tpSupression,
        "autoRemove":$active,
    });
    
    if(data!=null){
        return($tpSupression, $active);
    }

    //Modifier la table Parametre de la BD pour ajouter des valeurs pour : 
    //(heure, jour, mois)

}




document.addEventListener("DOMContentLoaded", () => {
    getParametre();
    postParametre();
});