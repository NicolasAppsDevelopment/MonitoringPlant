/**
 * Sets default settings
 */
async function setDefaultSettings() {
    displayLoading("Initialisation des paramètres...");

    const data = await phpPost("/phpApi/setSettings.php", {
        "timeConservation": 1,
        "timeConservationUnit": "mois",
        "enableAutoRemove": false,
        "network": "Cellule de mesure"
    });

    hideLoading();

    if (data != null) {
        window.location.href = "setupTime.php";
    }
}