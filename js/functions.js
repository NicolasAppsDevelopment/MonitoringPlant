/**
 * Checks if the raspberry pi's time is the same as the device using the website.
 */
async function checkTime() {
    const client_datetime = new Date();
    const data = await phpPost("phpApi/checkTime.php", {
        "client_datetime": client_datetime
    });

    if (data!=null && !data["up_to_date"]){
        if (await displayConfirm("Potentiel décalage d'heure détécté", "Il semblerait que la date et l'heure de la cellule de mesure soit décalé par rapport à votre appareil. Voulez-vous mettre à jour la date et l'heure de la cellule ?", 'Changer la date & heure', false)) {
            window.location = "/setupTime.php"
        }
    }
}

/**
 * Wait for a certain amount of time
 * @param {Number} milliSeconds The time to wait
 */
async function delay(milliSeconds) {
    return await new Promise(resolve => setTimeout(resolve, milliSeconds));
}

/**
 * Toogle the display of a password field
 * @param {HTMLElement} icon The display/hide HTML button
 * @param {String} id id of the HTML input password field
 */
function displayHide(icon, id) {
    let input = this.document.getElementById(id);
    if (icon.classList.contains('btn-eye-show')) {
        icon.classList.add('btn-eye-hide');
        icon.classList.remove('btn-eye-show');
        input.setAttribute('type', 'text')
    } else {
        icon.classList.add('btn-eye-show');
        icon.classList.remove('btn-eye-hide');
        input.setAttribute('type', 'password')
    }
}