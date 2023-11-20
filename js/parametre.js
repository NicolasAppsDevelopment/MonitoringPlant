async function getParametre()
{
    var data = await PHP_get("/PHP_API/get_parametre.php");

    if (data["active"]){
        document.getElementById("auto_suppr").checked=true;
    }else{
        document.getElementById("auto_suppr").checked=false;
    }

    var valeur=document.getElementById("conserv");
    valeur.setAttribute('value',data["IntervalSuppression"])
    //Modifier la table Parametre de la BD pour ajouter des valeurs pour : 
    //(heure, jour, mois)

}

async function postParametre()
{
    var data = await PHP_post("/PHP_API/get_parametre.php");
    if (document.getElementById("auto_suppr").checked==true){
        $active=true;
        $tpSupression=data["IntervalSuppression"];
    }else{
        $active=false;
        $tpSupression=null;
    }

    //Modifier la table Parametre de la BD pour ajouter des valeurs pour : 
    //(heure, jour, mois)

}




document.addEventListener("DOMContentLoaded", () => {
    getParametre();
    postParametre();

});