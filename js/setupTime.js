/**
 * Set raspberry pi date and time
 */

async function setTime() {
    displayLoading("Mise à jour de l'heure...");

    const date = document.getElementById("date").value;
    const time = document.getElementById("heure").value;
    const datetime = String(date + " " + time);

    const data = await PHP_post("/PHP_API/setTime.php", {
        "datetime": datetime,
    });

    if (data != null) {
        window.location.href = "index.php";
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

            const now_ = new Date(document.getElementById("date").value + " " + document.getElementById("heure").value);
            now_.setMinutes(now_.getMinutes() + 1);

            const datetime_ = dateToStandardString(now_);
            const date_ = datetime_["date"];
            const time_ = datetime_["time"];
            document.getElementById("heure").value = time_;
            document.getElementById("date").value = date_;
        }
    }, 1000);
});