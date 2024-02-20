/**
 * Sets default settings
 */
async function setDefaultSettings() {
    displayLoading("Initialisation des paramètres...");

    const data = await PHP_post("/PHP_API/setSettings.php", {
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