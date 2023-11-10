<div class="popup" id="error_popup_container">
    <div class="card inner-error-popup" id="error_popup">
        <div class="card-header">
            <b class="card-title">Erreur :(</b>
            <div class="status-actions">
                <div class="status-action-container stop" onclick="hideError()">
                    <svg class="action-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0,0,256,256"><g transform="translate(-53.76,-53.76) scale(1.42,1.42)"><g fill="currentColor" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(5.33333,5.33333)"><path transform="translate(24.00059,-9.94113) rotate(45.001)" d="M21.5,4.5h5.001v39h-5.001z"></path><path transform="translate(57.94113,24.00474) rotate(135.008)" d="M21.5,4.5h5v39.001h-5z"></path></g></g></g></svg>
                </div>
            </div>
        </div>
        <div class="card-body">
            <div class="status-row">
                <div class="status-title">
                    <img style="width: 16px;" class="status-icon" src="./img/error_status.svg">
                    <span id="error_title">Erreur avec le capteur d'O2</span>
                </div>
                <span class="status-message" id="error_msg">
                    La campagne de mesure est toujours en cours, cependant à 12:35:24 le 12/12/2022 le capteur d'O2 a rencontré une erreur irrécupérable.<br>
                    Fin de la campagne de mesure dans 3 heures.
                </span>
            </div>
        </div>
    </div>
</div>