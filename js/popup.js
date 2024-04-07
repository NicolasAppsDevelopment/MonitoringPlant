let blurCompatibility = true;

if (navigator.userAgent.includes("Chrome/")) {
    blurCompatibility = false;
}

let idMessage = 0;

/**
 * Creates and displays a popup to confirm or cancel an important action.
 * @param {String} title Title of the popup
 * @param {String} msg Message of the popup
 * @param {String} confirmBtnTitle Title of the button of confirmation
 * @param {boolean} destructive True if there is a risk of data loss or if there is a suppression of data. False otherwise.
 * @param {String} cancelBtnTitle Title of the button to cancel the action
 * @returns {boolean} True if the user confirms the action and false if he cancels it
 */
async function displayConfirm(title, msg, confirmBtnTitle, destructive = false, cancelBtnTitle = "Annuler") {
    const id = idMessage;
    idMessage++;

    const htmlPopup = `
        <div class="popup open_anim" id="confirm_popup_container${id}">
            <div id="confirm_popup${id}" class="msgbox-popup-inner ${blurCompatibility ? "backdrop-blur" : "backdrop-color"}">
                <div class="popup-content center">
                    <img src="./img/warning_ico.svg" class="ico_msgbox">
                    <p class="title_msgbox">${title}</p>
                    <p class="msg_msgbox">${msg}</p>
                    
                    <div class="actions_msgbox">
                        <button id="confirm${id}" class="shadow_btn rect_round_btn ${destructive ? "destructive" : "gray"}" type="button">${confirmBtnTitle}</button>
                        <button id="cancel${id}" class="rect_round_btn gray shadow_btn" type="button">${cancelBtnTitle}</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML("beforeend", htmlPopup);

    const promise = new Promise((resolve, reject) => {
        document.getElementById("confirm" + id).addEventListener('click', resolve)
        document.getElementById("cancel" + id).addEventListener('click', reject)
    });


    return await promise
    .then(() => {
        hideConfirm(id);
        return true;
    })
    .catch(() => {
        hideConfirm(id);
        return false;
    })
}
 
/**
 * Hides the confirmation popup whose id is in the parameter.
 * @param {Number} id id of the popup that will be hidden
 */
async function hideConfirm(id) {
    const popupContainer = document.getElementById("confirm_popup_container" + id);
    popupContainer.classList.remove("open_anim");
    popupContainer.classList.add("close_anim");

    setTimeout(function() {
        popupContainer.remove();
    }, 300);
}

/**
 * Creates and displays an error report popup.
 * @param {String} title Title of the popup
 * @param {String} msg Message of the popup
 */
async function displayError(title, msg) {
    const id = idMessage;
    idMessage++;

    const htmlPopup = `
        <div class="popup open_anim" id="error_popup_container${id}">
            <div id="error_popup${id}" class="msgbox-popup-inner ${blurCompatibility ? "backdrop-blur" : "backdrop-color"}">    
                <div class="popup-content center">
                    <img src="./img/error_ico.svg" class="ico_msgbox">
                    <p class="title_msgbox">${title}</p>
                    <p class="msg_msgbox">${msg}</p>
                    
                    <div class="actions_msgbox">
                        <button id="close${id}" class="rect_round_btn gray shadow_btn" type="button">OK</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML("beforeend", htmlPopup);

    const promise = new Promise((resolve) => {
        document.getElementById("close" + id).addEventListener('click', resolve)
    });


    return await promise
    .then(() => {
        hideError(id);
    })
}

/**
 * Hides the error report popup whose id is in the parameter.
 * @param {Number} id id of the popup that will be hidden
 */
async function hideError(id) {
    const popupContainer = document.getElementById("error_popup_container" + id);
    popupContainer.classList.remove("open_anim");
    popupContainer.classList.add("close_anim");

    setTimeout(function() {
        popupContainer.remove();
    }, 300);
}

/**
 * Creates and displays a success report popup.
 * @param {String} title Title of the popup
 * @param {String} msg Message of the popup
 */
async function displaySuccess(title, msg) {
    const id = idMessage;
    idMessage++;

    const htmlPopup = `
        <div class="popup open_anim" id="success_popup_container${id}">
            <div id="success_popup${id}" class="msgbox-popup-inner ${blurCompatibility ? "backdrop-blur" : "backdrop-color"}">    
                <div class="popup-content center">
                    <img src="./img/success_ico.svg" class="ico_msgbox">
                    <p class="title_msgbox">${title}</p>
                    <p class="msg_msgbox">${msg}</p>
                    
                    <div class="actions_msgbox">
                        <button id="close${id}" class="rect_round_btn gray shadow_btn" type="button">OK</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML("beforeend", htmlPopup);

    const promise = new Promise((resolve) => {
        document.getElementById("close" + id).addEventListener('click', resolve)
    });


    return await promise
    .then(() => {
        hideSuccess(id);
    })
}

/**
 * Hides the success report popup whose id is in the parameter.
 * @param {Number} id id of the popup that will be hidden
 */
async function hideSuccess(id) {
    const popupContainer = document.getElementById("success_popup_container" + id);
    popupContainer.classList.remove("open_anim");
    popupContainer.classList.add("close_anim");

    setTimeout(function() {
        popupContainer.remove();
    }, 300);
}

/**
 * Displays a loading popup with a custom message.
 * @param {String} msg Message of the popup (default: "Chargement...")
 */
async function displayLoading(msg = "Chargement...") {
    const popupContainer = document.getElementById("loading_popup_container");
    const popup = document.getElementById("loading_popup");
    popup.style.transform = "scale(1)";

    document.getElementById("loading_msg").innerHTML = msg.replace("\n", "<br>");
    
    popupContainer.style.opacity = 1;
    popupContainer.style.visibility = "inherit";
}

/**
 * Hides the loading popup.
 */
async function hideLoading() {
    const popupContainer = document.getElementById("loading_popup_container");
    popupContainer.classList.remove("displayed");
    const popup = document.getElementById("loading_popup");
    popup.removeAttribute("style");
    popupContainer.removeAttribute("style");
}

/**
 * Closes the popup whose id is in parameter
 * @param {Number} id id of the popup that will be closed
 */
async function closePopup(id) {
    document.getElementById(id).checked = false;
}

/**
 * Opens the popup whose id is in parameter
 * @param {Number} id id of the popup that will be opened
 */
async function openPopup(id) {
    document.getElementById(id).checked = true;
}