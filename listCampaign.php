<?php
    include_once "include/checkSetup.php";
?>
<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link href="./css/style.css" rel="stylesheet">
    <script src="./js/popup.js"></script>
    <script src="./js/request.js"></script>
    <script src="./js/date.js"></script>
    <script src="./js/functions.js"></script>
    <script src="./js/listCampaign.js"></script>
    <title>Liste des campagnes</title>

    <link rel="preload" href="./img/error_ico.svg" as="image" />
    <link rel="preload" href="./img/warning_ico.svg" as="image" />
</head>

<body class="bg main_theme">

    <!-- Navigation -->
    <?php include "modules/header.php"; ?>

    <input type="hidden" name="isAdmin" id="isAdmin" value="<?= $session->isAdmin() ? "true" : "false" ?>">

    <main>
        <div class="top_action_menu">

            <!-- Search bar -->
            <input type="text" placeholder="Rechercher..." class="custom_search_bar" id="campaign_name_search_bar" onkeydown="handleKeyPressSearchBar(event)">

            <!-- Filter popup & button -->
            <div class="btn_container"><label for="filter-popup" class="round_btn default filter"></label></div>
            <input type="checkbox" id="filter-popup" class="open_close-popup">
            <div class="popup">
                <div class="popup-inner">
                    <div class="popup-title">
                        <p>Filtrer une campagne</p>
                        <label for="filter-popup" class="round_btn transparent small close"></label>
                    </div>
                    <div class="popup-content">

                        <div class="label_img_input">
                            <label class="label_field" for="datetime">Définir la plage de temps dans laquelle les campagnes de mesures ont été faites</label>
                            <div class="row_fields gap with_subtitle">
                                <p>De :</p>
                                <input class="input_field calendar" id="datedebut_choice" name="date" type="date" placeholder="Date">
                                <input class="input_field clock" id="heuredebut_choice" name="time" type="time" placeholder="Heure">
                            </div>
                            <div class="row_fields gap with_subtitle">
                                <p>À :</p>
                                <input class="input_field calendar" id="datefin_choice" name="date" type="date" placeholder="Date">
                                <input class="input_field clock" id="heurefin_choice" name="time" type="time" placeholder="Heure">
                            </div>
                        </div>

                        <div class="checkbox bottom_gap">
                            <label for="processing">
                                <input type="checkbox" id="processing">
                                <span class="cbx">
                                    <svg width="12px" height="11px" viewBox="0 0 12 11">
                                        <polyline points="1 6.29411765 4.5 10 11 1"></polyline>
                                    </svg>
                                </span>
                                <span>Filtrer par campagnes en cours</span>
                            </label>
                        </div>
                        <div class="checkbox bottom_gap">
                            <label for="success">
                                <input type="checkbox" id="success">
                                <span class="cbx">
                                    <svg width="12px" height="11px" viewBox="0 0 12 11">
                                        <polyline points="1 6.29411765 4.5 10 11 1"></polyline>
                                    </svg>
                                </span>
                                <span>Filtrer par campagnes terminées avec succès</span>
                            </label>
                        </div>
                        <div class="checkbox bottom_gap">
                            <label for="error">
                                <input type="checkbox" id="error">
                                <span class="cbx">
                                    <svg width="12px" height="11px" viewBox="0 0 12 11">
                                        <polyline points="1 6.29411765 4.5 10 11 1"></polyline>
                                    </svg>
                                </span>
                                <span>Filtrer par campagnes terminées par une erreur</span>
                            </label>
                        </div>
                        <div class="checkbox bottom_gap">
                            <label for="warn">
                                <input type="checkbox" id="warn">
                                <span class="cbx">
                                    <svg width="12px" height="11px" viewBox="0 0 12 11">
                                        <polyline points="1 6.29411765 4.5 10 11 1"></polyline>
                                    </svg>
                                </span>
                                <span>Filtrer par campagnes avec un/des avertissements</span>
                            </label>
                        </div>
                        
                        <button class="rect_round_btn gray bottom_gap" type="button" onclick="resetFilter()">Réinitialiser le filtre</button>
                        <button class="rect_round_btn gray" type="button" onclick="filterCampaigns()">Filtrer</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- List of campaigns -->
        <div class="liste_CM" id="CM_container">
            <div class="loading_popup" id="loading_div">
                <svg class="spinner" viewBox="0 0 50 50">
                    <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
                </svg>
                <p class="loading_msg">Récupération des campagnes...</p>
            </div>
        </div>
    </main>

    <!-- Create a campaign popup & button -->
    <label for="add-popup" class="floating round_btn default add"></label>
    <input type="checkbox" id="add-popup" class="open_close-popup">
    <div class="popup">
        <div class="popup-inner">
            <div class="popup-title">
                <p>Démarrer une campagne</p>
                <label for="add-popup" class="round_btn transparent small close"></label>
            </div>
            <form id="add_popup_form" class="popup-content" method="post" action="campaign.php">
                <input id="id_added_campaign" type="hidden" name="id" value="-1">

                <div class="grid_section">
                    <label class="icon-checkbox-wrapper">
                        <input id="CO2_checkbox" type="checkbox" class="checkbox-input" hidden />
                        <span class="checkbox-tile">
                            <span class="checkbox-icon">
                                <img src="./img/CO2.svg" alt="CO2 icone">
                            </span>
                            <span class="checkbox-label">CO2</span>
                        </span>
                    </label>
                    <label class="icon-checkbox-wrapper">
                        <input id="O2_checkbox" type="checkbox" class="checkbox-input" hidden />
                        <span class="checkbox-tile">
                            <span class="checkbox-icon">
                                <img src="./img/O2.svg" alt="O2 icone">
                            </span>
                            <span class="checkbox-label">O2</span>
                        </span>
                    </label>
                    <label class="icon-checkbox-wrapper">
                        <input id="temperature_checkbox" type="checkbox" class="checkbox-input" hidden />
                        <span class="checkbox-tile">
                            <span class="checkbox-icon">
                                <img src="./img/tempeture.svg" alt="Température icone">
                            </span>
                            <span class="checkbox-label">Température</span>
                        </span>
                    </label>
                    <label class="icon-checkbox-wrapper">
                        <input id="humidity_checkbox" type="checkbox" class="checkbox-input" hidden />
                        <span class="checkbox-tile">
                            <span class="checkbox-icon">
                                <img src="./img/humidity.svg" alt="Humidité icone">
                            </span>
                            <span class="checkbox-label">Humidité</span>
                        </span>
                    </label>
                    <label class="icon-checkbox-wrapper">
                        <input id="luminosity_checkbox" type="checkbox" class="checkbox-input" hidden />
                        <span class="checkbox-tile">
                            <span class="checkbox-icon">
                                <img src="./img/luminosity.svg" alt="Luminosité icone">
                            </span>
                            <span class="checkbox-label">Luminosité</span>
                        </span>
                    </label>
                </div>


                <div class="label_img_input">
                    <label class="label_field" for="duration_input">Durée de la campagne de mesure</label>
                    <div class="row_fields">
                        <input class="input_field clock" id="duration_input" type="number" placeholder="Durée" min="0" required oninput="predictStoreUsage()">
                        <select class="combo_box" id="duration_unit_combo_box" onchange="predictStoreUsage()">
                            <option selected value="s">s</option>
                            <option value="min">min</option>
                            <option value="h">h</option>
                            <option value="j">j</option>
                        </select>
                    </div>
                </div>

                <div class="label_img_input">
                    <label class="label_field" for="interval_input">Intervalle de la campagne de mesure</label>
                    <div class="row_fields">
                        <input class="input_field timer" id="interval_input" type="number" placeholder="Intervalle" min="0" required oninput="predictStoreUsage()">
                        <select class="combo_box" id="interval_unit_combo_box" onchange="predictStoreUsage()">
                            <option selected value="s">s</option>
                            <option value="min">min</option>
                            <option value="h">h</option>
                            <option value="j">j</option>
                        </select>
                    </div>
                </div>

                <div class="label_img_input">
                    <div class="row">
                        <label class="label_field" for="volume_input">Volume du contenant</label>
                        <div class="annotation">Champs optionnel</div>
                    </div>

                    <div class="row_fields">
                        <input class="input_field volume" id="volume_input" type="number" placeholder="Volume" min="0" step=".01">
                        <select class="combo_box" id="volume_unit_combo_box">
                            <option selected value="mL">mL</option>
                            <option value="cL">cL</option>
                        </select>
                    </div>
                </div>

                <div class="label_img_input">
                    <label class="label_field" for="name_input">Nom de la campagne de mesure</label>
                    <input class="input_field edit" id="name_input" type="text" placeholder="Nom" required>
                </div>

                <div class="label_img_input">
                    <label class="label_field" for="config_input">Configuration</label>
                    <select class="combo_box no-side-margin" id="config_combo_box">
                    </select>
                </div>

                <div class="checkbox">
                    <label for="humid_mode">
                        <input type="checkbox" id="humid_mode">
                        <span class="cbx">
                            <svg width="12px" height="11px" viewBox="0 0 12 11">
                                <polyline points="1 6.29411765 4.5 10 11 1"></polyline>
                            </svg>
                        </span>
                        <span>Mesure en milieu humide ? (coché = Oui)</span>
                    </label>
                </div>

                <div class="checkbox">
                    <label for="enable_fibox_temp">
                        <input type="checkbox" id="enable_fibox_temp">
                        <span class="cbx">
                            <svg width="12px" height="11px" viewBox="0 0 12 11">
                                <polyline points="1 6.29411765 4.5 10 11 1"></polyline>
                            </svg>
                        </span>
                        <span>Activer le capteur de température PreSens ? (coché = Oui)</span>
                    </label>
                </div>

                <div class="section">
                    <div class="row_center" id="space_taken_warning">

                    </div>
                    <div class="row">
                        <p class="device_name">Cellule</p>
                        <p class="storage_txt" id="storage_txt">Calcul...</p>
                    </div>
                    <div class="storage_bar_container">
                        <div id="used_storage_bar" class="used_storage_bar"></div>
                        <div id="use_storage_bar" class="use_storage_bar"></div>
                    </div>
                    <div class="row_no_space">
                        <div class="legend">
                            <div class="dot_legend_used"></div>
                            <p class="legend_name">Espace utilisé</p>
                        </div>
                        <div class="legend">
                            <div class="dot_legend_use"></div>
                            <p class="legend_name">Espace estimé de la mesure</p>
                        </div>
                    </div>
                </div>

                <button class="rect_round_btn gray" type="button" onclick="addCampaign()">Démarrer</button>
            </form>
        </div>
    </div>

    <!-- loading popup -->
    <?php include "modules/loadingPopup.php"; ?>
</body>

</html>
