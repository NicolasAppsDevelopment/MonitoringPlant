/**
 * Sets raspberry pi date and time.
 */

async function setTime() {
    displayLoading("Mise à jour de l'heure...");

    const date = document.getElementById("date").value;
    const time = document.getElementById("heure").value;
    const datetime = String(date + " " + time);

    const data = await phpPost("phpApi/setTime.php", {
        "datetime": datetime,
    });
    
    if (data != null) {
        window.location.href = "listCampaign.php";
    }
    
    hideLoading();
}

async function resetSeconds() {
    seconds = 0;
}

let seconds = 0;
document.addEventListener("DOMContentLoaded", () => {
    const now = new Date();
    const datetime = dateToStandardString(now);
    const date = datetime["date"];
    const time = datetime["time"];
    document.getElementById("heure").value = time;
    document.getElementById("date").value = date;

    seconds = now.getSeconds();
    setInterval(() => {
        seconds++;
        if (seconds >= 60) {
            seconds = 0;

            const selectedDateTime = new Date(document.getElementById("date").value + " " + document.getElementById("heure").value);
            selectedDateTime.setMinutes(selectedDateTime.getMinutes() + 1);

            const selectedDateTimeStandardString = dateToStandardString(selectedDateTime);
            const selectedDateStandardString = selectedDateTimeStandardString["date"];
            const selectedTimeStandardString = selectedDateTimeStandardString["time"];
            document.getElementById("heure").value = selectedTimeStandardString;
            document.getElementById("date").value = selectedDateStandardString;
        }
    }, 1000);
});