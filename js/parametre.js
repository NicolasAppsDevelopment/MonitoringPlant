async function getParametre()
{

    data = await PHP_get("/PHP_API/get_parametre.php");

    if (data['IntervalSuppression']<=0){
        document.getElementById("auto_suppr")=false;
    }else{
        document.getElementById("auto_suppr")=true;

    }
    document.getElementById("conserv").setAttribute('value',data['IntervalSuppression']);
    //Modifier la table Parametre de la BD pour ajouter des valeurs pour : 
    //(heure, jour, mois)
    //
}

document.addEventListener("DOMContentLoaded", () => {
    getParametre();


});