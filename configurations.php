<?php include "include/checkSetup.php";?>
<!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="./css/style.css" rel="stylesheet">
        <script src="./js/functions.js"></script>
        <script src="./js/configurations.js"></script>
        <title>Liste des configurations</title>

        <link rel="preload" href="./img/error_ico.svg" as="image"/>
        <link rel="preload" href="./img/warning_ico.svg" as="image"/>
    </head>
    <body class="bg main_theme">

        <!-- Navigation -->
        <?php include "modules/header.php";?>
        
        <main>
            <div class="top_action_menu">
                <!-- Search bar -->
                <input type="text" placeholder="Rechercher..." class="custom_search_bar" id="config_name_search_bar" onkeydown="handleKeyPressSearchBar(event)">
            </div>

            <!-- List of configs -->
            <div class="liste_CM" id="config_container">
                <div class="loading_popup" id="loading_div">
                    <svg class="spinner" viewBox="0 0 50 50">
                        <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
                    </svg>
                    <p class="loading_msg">Récupération des configurations...</p>
                </div>
            </div>
        </main>

        <!-- Create a config popup & button -->
        <label for="add-popup" class="floating round_btn default add" onclick="prepareAddPopup()"></label>
        <input type="checkbox" id="add-popup" class="open_close-popup">
        <div class="popup">
            <div class="popup-inner">
                <div class="popup-title">
                    <p id="add-popup-title">Ajouter une configuration</p>
                    <label for="add-popup" class="round_btn transparent small close"></label>
                </div>
                <form id="add_popup_form" class="popup-content">
                    <input id="id_added_config" type="hidden" name="id" value="-1">

                    <div class="label_img_input">
                        <label class="label_field" for="name_input">Nom de la configuration</label>
                        <input class="input_field edit" id="name_input" type="text" placeholder="Nom" required>
                    </div>

                    <div class="label_img_input">
                        <label class="label_field" for="alt_input">Altitude (en mètre)</label>
                        <input class="input_field elevation" id="alt_input" type="number" placeholder="Altitude" required>
                    </div>

                    <!-- Constants PreSens -->
                    <div class="section_head_container">
                        <h2 class="section_head">Constantes PreSens</h2>
                    </div>

                    <div class="label_img_input">
                        <label class="label_field" for="f1_input">f1</label>
                        <input class="input_field object" id="f1_input" type="number" step=".000000001" placeholder="f1" required>
                    </div>

                    <div class="label_img_input">
                        <label class="label_field" for="m_input">m</label>
                        <input class="input_field object" id="m_input" type="number" step=".000000001" placeholder="m" required>
                    </div>
                    
                    <div class="label_img_input">
                        <label class="label_field" for="dphi1_input">dPhi1</label>
                        <input class="input_field object" id="dphi1_input" type="number" step=".000000001" placeholder="dPhi1" required>
                    </div>

                    <div class="label_img_input">
                        <label class="label_field" for="dphi2_input">dPhi2</label>
                        <input class="input_field object" id="dphi2_input" type="number" step=".000000001" placeholder="dPhi2" required>
                    </div>

                    <div class="label_img_input">
                        <label class="label_field" for="dksv1_input">dKSV1</label>
                        <input class="input_field object" id="dksv1_input" type="number" step=".000000001" placeholder="dKsv1" required>
                    </div>

                    <div class="label_img_input">
                        <label class="label_field" for="dksv2_input">dKSV2</label>
                        <input class="input_field object" id="dksv2_input" type="number" step=".000000001" placeholder="dKsv2" required>
                    </div>

                    <div class="section_head_container">
                        <h2 class="section_head">Données de calibration PreSens</h2>
                    </div>

                    <div class="label_img_input">
                        <label class="label_field" for="pressure_input">Pression atmosphérique (en hPa)</label>
                        <input class="input_field pressure" id="pressure_input" type="number" min="0" placeholder="Pression" required>
                    </div>

                    <div class="checkbox">
                        <label for="calib_is_humid">
                            <input type="checkbox" id="calib_is_humid">
                            <span class="cbx">
                                <svg width="12px" height="11px" viewBox="0 0 12 11">
                                    <polyline points="1 6.29411765 4.5 10 11 1"></polyline>
                                </svg>
                            </span>
                            <span>Calibration en milieu humide ? (coché = Oui)</span>
                        </label>
                    </div>

                    <div class="sub_section_head_container">
                        <h2 class="sub_section_head">1ère calibration à 0% d'air-sat. (cal0)</h2>
                    </div>
                    <div class="sub_section_container">
                        <div class="label_img_input">
                            <label class="label_field" for="cal0_input">Phase (en °)</label>
                            <input class="input_field sinus" id="cal0_input" type="number" step=".0001" placeholder="Phase cal0" required>
                        </div>

                        <div class="label_img_input">
                            <label class="label_field" for="t0_input">Température (en °C)</label>
                            <input class="input_field temperature" id="t0_input" type="number" step=".01" placeholder="Température cal0" required>
                        </div>
                    </div>

                    <div class="sub_section_head_container">
                        <h2 class="sub_section_head">2e calibration à x% d'air-sat. (cal2nd)</h2>
                    </div>
                    <div class="sub_section_container bottom_gap">
                        <div class="label_img_input">
                            <label class="label_field" for="o2cal2nd_input">%air-sat. (en %)</label>
                            <input class="input_field percent" id="o2cal2nd_input" type="number" min="0" max="100" placeholder="%air-sat." required>
                        </div>

                        <div class="label_img_input">
                            <label class="label_field" for="cal2nd_input">Phase (en °)</label>
                            <input class="input_field sinus" id="cal2nd_input" type="number"  step=".0001" placeholder="Phase cal2nd" required>
                        </div>

                        <div class="label_img_input">
                            <label class="label_field" for="t2nd_input">Température (en °C)</label>
                            <input class="input_field temperature" id="t2nd_input" type="number"  step=".01" placeholder="Température cal2nd" required>
                        </div>
                    </div>

                    <button id="add-popup-btn" class="rect_round_btn gray" type="button" onclick="saveConfiguration();">Ajouter</button>
                </form>
            </div>
        </div>

        <!-- loading popup -->
        <?php include "modules/loadingPopup.php";?>
    </body>
</html>