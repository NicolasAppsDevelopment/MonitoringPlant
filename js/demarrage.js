/**
 * Sets default settings
 */
async function setParameter() {
    displayLoading("Initialisation des paramètres...");

    const data = await PHP_post("/PHP_API/set_settings.php", {
        "autoremove.timeConservation": 1,
        "autoremove.timeConservationUnit": "mois",
        "autoremove.enableAutoRemove": false,
        "altitude":240
    });
    if (data != null) {
        window.location.href = "setup_time.php";
    }
    
    hideLoading();
}