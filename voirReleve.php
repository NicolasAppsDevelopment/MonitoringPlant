<?php
    if (!isset($_POST['id']) || empty($_POST['id']) || !is_numeric($_POST['id'])){
        header("Location: /");
    }
?>

<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="./css/style.css" rel="stylesheet">
    <script src="./js/slider.js"></script>
    <link href="./css/slider.css" rel="stylesheet">
    <script src="./js/chart.js"></script>
    <script src="./js/display_chart.js"></script>
    <script src="./js/functions.js"></script>
    <script src="./js/voirReleve.js"></script>
    <title>Voir Releve</title>
</head>

<body class="bg main_theme">
    <?php include "modules/header.php";?>
    
    <input type="hidden" id="id_campagne" value="<?= $_POST['id'] ?>">

    <main>
        <div class="top_action_menu">
            <div class="back_title">
                <a href="./index.php" class="row_center">
                    <div class="back_btn">
                        <p>Retour</p>
                    </div>
                </a>
                <p class="title" id="titleCampaign"></p>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <b class="card-title">État de la campagne</b>
                <div class="status-actions">
                    <div class="status-action-container restart">
                        <svg class="action-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0,0,256,256"><g transform="translate(-11.52,-11.52) scale(1.09,1.09)"><g fill="currentColor" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="none" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path transform="scale(10.66667,10.66667)" d="M9,2v7l-2.65039,-2.65039c-1.44913,1.44767 -2.34961,3.4444 -2.34961,5.65039c0,4.411 3.589,8 8,8c4.411,0 8,-3.589 8,-8c0,-4.411 -3.589,-8 -8,-8v-2c5.514,0 10,4.486 10,10c0,5.514 -4.486,10 -10,10c-5.514,0 -10,-4.486 -10,-10c0,-2.75729 1.12627,-5.25179 2.93945,-7.06055l-2.93945,-2.93945z" id="strokeMainSVG" stroke="currentColor" stroke-linejoin="round"></path><g transform="scale(10.66667,10.66667)" stroke="none" stroke-linejoin="miter"><path d="M2,2l2.93945,2.93945c-1.81318,1.80876 -2.93945,4.30325 -2.93945,7.06055c0,5.514 4.486,10 10,10c5.514,0 10,-4.486 10,-10c0,-5.514 -4.486,-10 -10,-10v2c4.411,0 8,3.589 8,8c0,4.411 -3.589,8 -8,8c-4.411,0 -8,-3.589 -8,-8c0,-2.20599 0.90048,-4.20272 2.34961,-5.65039l2.65039,2.65039v-7z"></path></g></g></g></svg>
                    </div>
                    <div class="status-action-container stop">
                        <svg class="aciton-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0,0,256,256"><g transform="translate(-48.64,-48.64) scale(1.38,1.38)"><g fill="currentColor" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(5.12,5.12)"><path d="M8,8v34h34v-34z"></path></g></g></g></svg>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <div class="status-row">
                    <div class="status-title">
                        <img style="width: 16px;" class="status-icon" src="./img/error_status.svg">
                        Erreur avec le capteur d'O2
                    </div>
                    <span class="status-message">
                        La campagne de mesure est <span> </span>, cependant à 12:35:24 le 12/12/2022 le capteur d'O2 a rencontré une erreur irrécupérable.<br>
                        Fin de la campagne de mesure dans 3 heures.
                    </span>
                </div>
            </div>
        </div>


        <div class="swiffy-slider slider-item-reveal slider-nav-sm slider-nav-touch slider-nav-autohide">
            <ul class="slider-container">
                <li>
                    <div id="slide1" class="card slider-margin">
                        <div class="card-header title-only">
                            <b class="card-title">Configuration de la campagne</b>
                        </div>
                        <div class="card-body">
                            <div class="grid_section">
                                <label class="icon-checkbox-wrapper ok status">
                                    <span class="checkbox-tile">
                                        <span class="checkbox-icon">
                                            <img src="./img/CO2.svg">
                                        </span>
                                        <span class="checkbox-label">CO2</span>
                                    </span>
                                </label>
                                <label class="icon-checkbox-wrapper error status">
                                    <span class="checkbox-tile">
                                        <span class="checkbox-icon">
                                            <img src="./img/O2.svg">
                                        </span>
                                        <span class="checkbox-label">O2</span>
                                    </span>
                                </label>
                                <label class="icon-checkbox-wrapper unselected status">
                                    <span class="checkbox-tile">
                                        <span class="checkbox-icon">
                                            <img src="./img/tempeture.svg">
                                        </span>
                                        <span class="checkbox-label">Température</span>
                                    </span>
                                </label>
                                <label class="icon-checkbox-wrapper unselected status">
                                    <span class="checkbox-tile">
                                        <span class="checkbox-icon">
                                            <img src="./img/humidity.svg">
                                        </span>
                                        <span class="checkbox-label">Humidité</span>
                                    </span>
                                </label>
                                <label class="icon-checkbox-wrapper unselected status">
                                    <span class="checkbox-tile">
                                        <span class="checkbox-icon">
                                            <img src="./img/luminosity.svg">
                                        </span>
                                        <span class="checkbox-label">Luminosité</span>
                                    </span>
                                </label>
                            </div>

                            <table id="infoParametreCampagne">
                                <tbody>
                                    <tr>
                                        <th>
                                            <img src="./img/timer.svg" alt="">
                                            <p class="title_param">Durée : </p>
                                        </th>
                                        <td>
                                            <p></p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            <img src="./img/clock.svg" alt="">
                                            <p class="title_param">Intervalle : </p>
                                        </th>
                                        <td>
                                            <p></p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            <img src="./img/volume.svg" alt="">
                                            <p class="title_param">Volume : </p>
                                        </th>
                                        <td>
                                            <p></p>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </li>
                <li>
                    <div id="slide2" class="card slider-margin">
                        <div class="card-header title-only">
                            <b class="card-title">Tableau des données</b>
                        </div>
                        <div class="card-body mini-padding">
                            <div class="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>
                                                <div>
                                                    <img class="iconTableau" src="./img/clock.svg" alt="icone lumière">
                                                    <p>Date</p>
                                                </div>
                                            </th>
                                            <th>
                                                <div>
                                                    <img class="iconTableau" src="./img/luminosity.svg" alt="icone lumière">
                                                    <p>Luminosité</p>
                                                </div>
                                            </th>
                                            <th>
                                                <div>
                                                    <img class="iconTableau" src="./img/humidity.svg" alt="icone lumière">
                                                    <p>Humidité</p>
                                                </div>
                                            </th>
                                            <th>
                                                <div>
                                                    <img class="iconTableau" src="./img/tempeture.svg" alt="icone lumière">
                                                    <p>Température</p>
                                                </div>
                                            </th>
                                            <th>
                                                <div>
                                                    <img class="iconTableau" src="./img/O2.svg" alt="icone lumière">
                                                    <p>O2</p>
                                                </div>
                                            </th>
                                            <th>
                                                <div>
                                                    <img class="iconTableau" src="./img/CO2.svg" alt="icone lumière">
                                                    <p>CO2</p>
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody id="tableContent">
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td>></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>01/02/2001 10:30:12</td>
                                            <td>10.90</td>
                                            <td>0.12121</td>
                                            <td>0.212</td>
                                            <td>12.5°C</td>
                                            <td>0.212</td>
                                        </tr>
                                        <tr>
                                            <td>01/02/2001 10:30:12</td>
                                            <td>10.90</td>
                                            <td>0.12121</td>
                                            <td>0.212</td>
                                            <td>12.5°C</td>
                                            <td>0.212</td>
                                        </tr>
                                        <tr>
                                            <td>01/02/2001 10:30:12</td>
                                            <td>10.90</td>
                                            <td>0.12121</td>
                                            <td>0.212</td>
                                            <td>12.5°C</td>
                                            <td>0.212</td>
                                        </tr>
                                        <tr>
                                            <td>01/02/2001 10:30:12</td>
                                            <td>10.90</td>
                                            <td>0.12121</td>
                                            <td>0.212</td>
                                            <td>12.5°C</td>
                                            <td>0.212</td>
                                        </tr>
                                        <tr>
                                            <td>01/02/2001 10:30:12</td>
                                            <td>10.90</td>
                                            <td>0.12121</td>
                                            <td>0.212</td>
                                            <td>12.5°C</td>
                                            <td>0.212</td>
                                        </tr>
                                        <tr>
                                            <td>01/02/2001 10:30:12</td>
                                            <td>10.90</td>
                                            <td>0.12121</td>
                                            <td>0.212</td>
                                            <td>12.5°C</td>
                                            <td>0.212</td>
                                        </tr>
                                        <tr>
                                            <td>01/02/2001 10:30:12</td>
                                            <td>10.90</td>
                                            <td>0.12121</td>
                                            <td>0.212</td>
                                            <td>12.5°C</td>
                                            <td>0.212</td>
                                        </tr>
                                        <tr>
                                            <td>01/02/2001 10:30:12</td>
                                            <td>10.90</td>
                                            <td>0.12121</td>
                                            <td>0.212</td>
                                            <td>12.5°C</td>
                                            <td>0.212</td>
                                        </tr>
                                        <tr>
                                            <td>01/02/2001 10:30:12</td>
                                            <td>10.90</td>
                                            <td>0.12121</td>
                                            <td>0.212</td>
                                            <td>12.5°C</td>
                                            <td>0.212</td>
                                        </tr>
                                        <tr>
                                            <td>01/02/2001 10:30:12</td>
                                            <td>10.90</td>
                                            <td>0.12121</td>
                                            <td>0.212</td>
                                            <td>12.5°C</td>
                                            <td>0.212</td>
                                        </tr>
                                        <tr>
                                            <td>01/02/2001 10:30:12</td>
                                            <td>10.90</td>
                                            <td>0.12121</td>
                                            <td>0.212</td>
                                            <td>12.5°C</td>
                                            <td>0.212</td>
                                        </tr>
                                        <tr>
                                            <td>01/02/2001 10:30:12</td>
                                            <td>10.90</td>
                                            <td>0.12121</td>
                                            <td>0.212</td>
                                            <td>12.5°C</td>
                                            <td>0.212</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </li>
                <li>
                    <div id="slide3" class="card slider-margin">
                        <div class="card-header title-only">
                            <b class="card-title">Graphique des données</b>
                        </div>
                        <div class="card-body">
                            <div id="ChartContainer">
                                <canvas id="ChartCanvas"></canvas>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>

            <button type="button" class="slider-nav"></button>
            <button type="button" class="slider-nav slider-nav-next"></button>

            <ul class="slider-indicators">
                <li class="active"></li>
                <li></li>
                <li></li>
            </ul>
        </div>

        <!-- download popup & btn -->
        <div id="boutonTelechargerCampagne">
            <label for="filter-popup">
                <div class="rect_round_btn gray">Télécharger la campagne</div>
            </label>
        </div>
        <input type="checkbox" id="filter-popup" class="open_close-popup">
        <div class="popup">
            <div class="popup-inner">
                <div class="popup-title">
                    <p>Télécharger la campagne</p>
                    <label for="filter-popup" class="round_btn transparent small close"></label>
                </div>
                <div class="popup-content">

                    <p class="label_field">Sélectionnez les capteurs à télécharger</p>
                    <div class="grid_section">
                        <label class="icon-checkbox-wrapper">
                            <input type="checkbox" class="checkbox-input" hidden />
                            <span class="checkbox-tile">
                                <span class="checkbox-icon">
                                    <img src="./img/CO2.svg">
                                </span>
                                <span class="checkbox-label">CO2</span>
                            </span>
                        </label>
                        <label class="icon-checkbox-wrapper">
                            <input type="checkbox" class="checkbox-input" hidden />
                            <span class="checkbox-tile">
                                <span class="checkbox-icon">
                                    <img src="./img/O2.svg">
                                </span>
                                <span class="checkbox-label">O2</span>
                            </span>
                        </label>
                        <label class="icon-checkbox-wrapper">
                            <input type="checkbox" class="checkbox-input" hidden />
                            <span class="checkbox-tile">
                                <span class="checkbox-icon">
                                    <img src="./img/tempeture.svg">
                                </span>
                                <span class="checkbox-label">Température</span>
                            </span>
                        </label>
                        <label class="icon-checkbox-wrapper">
                            <input type="checkbox" class="checkbox-input" hidden />
                            <span class="checkbox-tile">
                                <span class="checkbox-icon">
                                    <img src="./img/humidity.svg">
                                </span>
                                <span class="checkbox-label">Humidité</span>
                            </span>
                        </label>
                        <label class="icon-checkbox-wrapper">
                            <input type="checkbox" class="checkbox-input" hidden />
                            <span class="checkbox-tile">
                                <span class="checkbox-icon">
                                    <img src="./img/luminosity.svg">
                                </span>
                                <span class="checkbox-label">Luminosité</span>
                            </span>
                        </label>
                    </div>


                    <div class="label_img_input no_bottom_gap">
                        <label class="label_field" for="interval">Redéfinir l'intervalle de la campagne de
                            mesure</label>
                        <div class="row_fields">
                            <input class="input_field timer" id="interval" name="interval" type="number"
                                placeholder="Intervalle" min="0" required>
                            <select class="combo_box">
                                <option selected value="s">s</option>
                                <option value="min">min</option>
                                <option value="h">h</option>
                                <option value="j">j</option>
                            </select>
                        </div>
                    </div>
                    <div class="checkbox">
                        <label for="moyennage">
                            <input type="checkbox" id="moyennage">
                            <span class="cbx">
                                <svg width="12px" height="11px" viewBox="0 0 12 11">
                                    <polyline points="1 6.29411765 4.5 10 11 1"></polyline>
                                </svg>
                            </span>
                            <span>Redéfinir par moyennage</span>
                        </label>
                    </div>

                    <div class="label_img_input">
                        <label class="label_field" for="datetime">Redéfinir la durée de la campagne de mesure</label>
                        <div class="row_fields gap with_subtitle">
                            <p>De :</p>
                            <input class="input_field calendar" id="datetime" name="date" type="date"
                                placeholder="Date">
                            <input class="input_field clock" id="datetime" name="time" type="time" placeholder="Heure">
                        </div>
                        <div class="row_fields gap with_subtitle">
                            <p>À :</p>
                            <input class="input_field calendar" id="datetime" name="date" type="date"
                                placeholder="Date">
                            <input class="input_field clock" id="datetime" name="time" type="time" placeholder="Heure">
                        </div>
                    </div>

                    <div class="checkbox bottom_gap">
                        <label for="volume">
                            <input type="checkbox" id="volume">
                            <span class="cbx">
                                <svg width="12px" height="11px" viewBox="0 0 12 11">
                                    <polyline points="1 6.29411765 4.5 10 11 1"></polyline>
                                </svg>
                            </span>
                            <span>Traiter les données en fonction du volume</span>
                        </label>
                    </div>

                    <button class="rect_round_btn gray" type="submit">Télécharger</button>
                </div>
            </div>
        </div>
    </main>

    <!-- loading popup -->
    <?php include "modules/loading_popup.php";?>
</body>

</html>