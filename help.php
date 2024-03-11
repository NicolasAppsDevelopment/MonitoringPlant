<?php 
    include_once "include/session.php";
    initSession();
?>
<!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="./css/style.css" rel="stylesheet">
        <title>Liste des campagnes</title>
        <script src="./js/help.js"></script>

        <link rel="preload" href="./img/error_ico.svg" as="image"/>
        <link rel="preload" href="./img/warning_ico.svg" as="image"/>
    </head>
    <body class="bg main_theme">

        <!-- Navigation -->
        <?php include "modules/header.php";?>
        <main>
            <!-- Search bar -->
            <input type="text" placeholder="Rechercher..." class="custom_search_bar" id="campaign_name_search_bar" onkeydown="handleKeyPressSearchBar(event)">
            <!-- List of Helps
            <div class="liste_CM" id="CM_container">
                <div class="loading_popup" id="loading_div">
                    <svg class="spinner" viewBox="0 0 50 50">
                        <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
                    </svg>
                    <p class="loading_msg">Récupération des aides...</p>
                </div>
            </div> -->

            <ul id="summary">
                <li  class="helpSummary" onclick="deroule('helpIndex')">
                    <h4>page Accueil</h4>
                    <ul class="summaryElement" id="helpIndex">
                        <li  onclick="loadPopUp('helpIndexArticle1')">Comment créer une nouvelle campagne de mesure ?</label>
                        <li onclick="loadPopUp('helpIndexArticle2')">Comment filtrer une campagne de mesure ? </label>

                    </ul>
                </li>
                

                <li  class="helpSummary" onclick="deroule('helpSettings')">
                    <h4>page Paramètre</h4>
                    <ul class="summaryElement" id="helpSettings">
                        <li onclick="loadPopUp('helpSettingsArticle1')" >Comment marche la Suppression automatique ?</label>
                        <li onclick="loadPopUp('helpSettingsArticle2')">Comment changer le nom du Wifi ?</label>

                    </ul>
                </li>    
                <li class="helpSummary" onclick="deroule('helpSeeData')">
                    <h4>page Voir Releve</h4>
                    <ul class="summaryElement" id="helpSeeData" >
                        <li onclick="loadPopUp('helpSeeDataArticle1')">Comment voir mes mesures sur Excel ?</label>
                        <li onclick="loadPopUp('helpSeeDataArticle2')">Comment redémmarer ma campagne ?</label>
                    </ul>
                </li>    
                <li  class="helpSummary" onclick="deroule('helpCalibrate')">
                    <h4>page Calibration</h4>
                    <ul class="summaryElement" id="helpCalibrate">
                        <li onclick="loadPopUp('helpCalibrateArticle1')">Enregistrer une nouvelle calibration</label>
                    </ul>
                </li>    
            
            </ul>
            
            <label for="help-popup" hidden>Enregistrer une nouvelle calibration</label>
            <input type="checkbox"  id="help-popup" class="open_close-popupHelp" value="1">
            <div id="popUpAide" hidden></div>
            

        </main>
    </body>
</html>
