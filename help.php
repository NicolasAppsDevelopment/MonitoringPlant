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

            <div class="top_action_menu">
                <!-- Search bar -->
                <input type="text" placeholder="Rechercher..." class="custom_search_bar" id="campaign_name_search_bar" onkeydown="handleKeyPressSearchBar(event)">
            </div>

            <!-- Grid of Helps -->
            <div class="grid">
                <div class="helpSummary" onclick="deroule('helpCampaign')">
                    <div class="preview">
                        <h4>Fonctionnalités Campagnes</h4>
                        <span>4 Articles</span>
                    </div>
                    <ul class="summaryElement" id="helpCampaign">
                        <li onclick="loadPopUp('helpCampaignArticle1')">Comment créer une nouvelle campagne de mesure ?</label>
                        <li onclick="loadPopUp('helpCampaignArticle2')">Comment filtrer une campagne de mesure ? </label>
                        <li onclick="loadPopUp('helpCampaignArticle3')">Comment avoir mes mesures sur Excel ?</label>
                        <li onclick="loadPopUp('helpCampaignArticle4')">Comment redémmarer ma campagne ?</label>
                    </ul>
                </div>
                <div class="helpSummary" onclick="deroule('helpSettings')">
                    <div class="preview">
                        <h4>Fonctionnalités Paramètres</h4>
                        <span>2 Articles</span>
                    </div>
                    <ul class="summaryElement" id="helpSettings">
                        <li onclick="loadPopUp('helpSettingsArticle1')" >Comment marche la Suppression automatique ?</label>
                        <li onclick="loadPopUp('helpSettingsArticle2')">Comment changer le nom du Wifi ?</label>
                    </ul>
                </div>      
                <div  class="helpSummary" onclick="deroule('helpCalibrate')">
                    <div class="preview">
                        <h4>Fonctionnalités Calibrations</h4>
                        <span>1 Article</span>
                    </div>
                    <ul class="summaryElement" id="helpCalibrate">
                        <li onclick="loadPopUp('helpCalibrateArticle1')">Enregistrer une nouvelle calibration</label>
                    </ul>
                </div>  
                <div  class="helpSummary" onclick="deroule('helpConnexion')">
                    <div class="preview">
                        <h4>Fonctionnalités Connexion</h4>
                        <span>1 Article</span>
                    </div>
                    <ul class="summaryElement" id="helpConnexion">
                        <li onclick="loadPopUp('helpConnexionArticle1')">Connexion avec les questions de sécurité</label>
                    </ul>
                </div>
            </div>

            <!-- PopUp -->
            <div id="popUpAide"></div>

        </main>
    </body>
</html>
