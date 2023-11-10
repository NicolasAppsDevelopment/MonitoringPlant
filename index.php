<!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="./css/style.css" rel="stylesheet">
        <script src="./js/functions.js"></script>
        <script src="./js/index.js"></script>
        <title>Accueil</title>
    </head>
    <body class="bg main_theme">
        <?php include "modules/header.php";?>
        <main>
            <div class="top_action_menu">
                <input type="text" placeholder="Rechercher..." class="custom_search_bar" id="custom_search_bar" onchange="">

                <!-- Filter popup & btn -->
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
                                <label class="label_field" for="datetime">Date de la campagne de mesure</label>
                                <div class="row_fields gap">
                                    <input class="input_field calendar" id="datetime" name="date" type="date" placeholder="Date">
                                    <input class="input_field clock" id="datetime" name="time" type="time" placeholder="Heure">
                                </div>
                            </div>

                            <button class="rect_round_btn gray" type="submit">Filtrer</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="liste_CM">
                <div class="loading_popup" id="loading_div">
                    <progress class="pure-material-progress-circular"></progress>
                    <p class="loading_msg">Récupération des campagnes...</p>
                </div>



                <!-- <a href="/voirReleve.php" class="CM processing">
                    <div class="title_detail_CM">
                        <p class="titre_CM">Test emballage carrote numéro 1</p>
                        <p class="detail_CM">En cours...</p>
                    </div>
                </a>
                <a href="/voirReleve.php" class="CM">
                    <div class="title_detail_CM">
                        <p class="titre_CM">Test emballage carrote numéro 1</p>
                        <p class="detail_CM">Créée il y a 3 semaines</p>
                    </div>

                    <button class="square_btn destructive remove small" onclick='event.preventDefault();'></button>
                </a> -->
            </div>     
        </main>

        <!-- Add popup & btn -->
        <label for="add-popup" class="floating round_btn default add"></label>
        <input type="checkbox" id="add-popup" class="open_close-popup">
        <div class="popup">
            <div class="popup-inner">
                <div class="popup-title">
                    <p>Démarrer une campagne</p>
                    <label for="add-popup" class="round_btn transparent small close"></label>
                </div>
                <form class="popup-content" method="post" enctype="multipart/form-data" action="index.php">
                    <div class="grid_section">
                        <label class="icon-checkbox-wrapper">
                            <input name="CO2" type="checkbox" class="checkbox-input" hidden/>
                            <span class="checkbox-tile">
                            <span class="checkbox-icon">
                                <img src="./img/CO2.svg">
                            </span>
                            <span class="checkbox-label">CO2</span>
                            </span>
                        </label>
                        <label class="icon-checkbox-wrapper">
                            <input name="O2" type="checkbox" class="checkbox-input" hidden/>
                            <span class="checkbox-tile">
                                <span class="checkbox-icon">
                                <img src="./img/O2.svg">
                                </span>
                                <span class="checkbox-label">O2</span>
                            </span>
                        </label>
                        <label class="icon-checkbox-wrapper">
                            <input name="temperature" type="checkbox" class="checkbox-input" hidden/>
                            <span class="checkbox-tile">
                                <span class="checkbox-icon">
                                <img src="./img/tempeture.svg">
                                </span>
                                <span class="checkbox-label">Température</span>
                            </span>
                        </label>
                        <label class="icon-checkbox-wrapper">
                            <input name="humidity" type="checkbox" class="checkbox-input" hidden/>
                            <span class="checkbox-tile">
                                <span class="checkbox-icon">
                                <img src="./img/humidity.svg">
                                </span>
                                <span class="checkbox-label">Humidité</span>
                            </span>
                        </label>
                        <label class="icon-checkbox-wrapper">
                            <input name="luminosity" type="checkbox" class="checkbox-input" hidden/>
                            <span class="checkbox-tile">
                                <span class="checkbox-icon">
                                <img src="./img/luminosity.svg">
                                </span>
                                <span class="checkbox-label">Luminosité</span>
                            </span>
                        </label>     
                    </div>
                    
                    
                    <div class="label_img_input">
                        <label class="label_field" for="duration">Durée de la campagne de mesure</label>
                        <div class="row_fields">
                            <input class="input_field clock" id="duration" name="duration" type="number" placeholder="Durée" min="0" required>
                            <select name="duration_untity" class="combo_box">
                                <option selected value="s">s</option>
                                <option value="min">min</option>
                                <option value="h">h</option>
                                <option value="j">j</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="label_img_input">
                        <label class="label_field" for="interval">Intervalle de la campagne de mesure</label>
                        <div class="row_fields">
                            <input class="input_field timer" id="interval" name="interval" type="number" placeholder="Intervalle" min="0" required>
                            <select name="interval_untity" class="combo_box">
                                <option selected value="s">s</option>
                                <option value="min">min</option>
                                <option value="h">h</option>
                                <option value="j">j</option>
                            </select>
                        </div>
                    </div>

                    <div class="label_img_input">
                        <div class="row">
                            <label class="label_field" for="volume">Volume du contenant</label>
                            <div class="annotation">Champs optionnel</div>
                        </div>
                        
                        <div class="row_fields">
                            <input class="input_field volume" id="volume" name="volume" type="number" placeholder="Volume" min="0">
                            <select name="volume_untity" class="combo_box">
                                <option selected value="mL">mL</option>
                                <option value="cL">cL</option>
                            </select>
                        </div>
                    </div>

                    <div class="label_img_input">
                        <label class="label_field" for="name">Nom de la campagne de mesure</label>
                        <input class="input_field edit" id="name" name="name" type="text" placeholder="Nom" required>
                    </div>

                    <div class="section">
                        <div class="row_center">
                            <div class="warning">Cette campagne va nécessiter un espace de stockage important (7%).</div>
                        </div>
                        <div class="row">
                            <p class="device_name">Cellule</p>
                            <p class="storage_txt">60% utilisé(s) • 45h restantes</p>
                        </div>
                        <div class="storage_bar_container">
                            <div class="used_storage_bar"></div>
                            <div class="use_storage_bar"></div>
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

                    <button class="rect_round_btn gray" type="submit">Démarrer</button>
                </form>
            </div>
        </div>

        <!-- error popup -->
        <?php include "modules/error_popup.php";?>
    </body>
</html>