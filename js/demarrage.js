async function setParameter() {
    displayLoading("Initialisation des paramètres...");

    const data = await PHP_post("/PHP_API/set_settings.php", {
        "autoremove.interval": 1,
        "autoremove.interval_unit": "mois",
        "autoremove.enabled": 0
    });
    if (data != null) {
        window.location.href = "setup_time.php";
    }
    
    hideLoading();
}