async function setTime() {
    displayLoading("Mise à jour de l'heure...");

    const date = document.getElementById("date").value;
    const hour = document.getElementById("heure").value;
    const time = String(date+" "+hour);

    const data = await NODERED_post("/PHP_API/set_time.php", {
        "time": time,
    });

    console.log(data);

    return;

    if (data != null) {
        window.location.href = "index.html";
    }
}
