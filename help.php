<!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="icon" type="image/x-icon" href="/favicon.ico">
        <link href="./css/style.css" rel="stylesheet">
        <title>Aide</title>
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
                <div class="helpSummary" onclick="unroll('helpCampaign', event)">
                    <div class="preview">
                        <h4>Fonctionnalités Campagnes</h4>
                        <span>4 Articles</span>
                    </div>
                    <ul class="summaryElement" id="helpCampaign">
                        <li onclick="goToHelpPage(0, event)">Comment créer une nouvelle campagne de mesure ?</label>
                        <li onclick="goToHelpPage(1, event)">Comment filtrer une campagne de mesure ? </label>
                        <li onclick="goToHelpPage(2, event)">Comment avoir mes mesures sur Excel ?</label>
                        <li onclick="goToHelpPage(3, event)">Comment redémmarer ma campagne ?</label>
                    </ul>
                </div>
                <div class="helpSummary" onclick="unroll('helpSettings', event)">
                    <div class="preview">
                        <h4>Fonctionnalités Paramètres</h4>
                        <span>2 Articles</span>
                    </div>
                    <ul class="summaryElement" id="helpSettings">
                        <li onclick="goToHelpPage(4, event)" >Comment marche la Suppression automatique ?</label>
                        <li onclick="goToHelpPage(5, event)">Comment changer le nom du Wi-Fi ?</label>
                    </ul>
                </div>
                <div  class="helpSummary" onclick="unroll('helpCalibrate', event)">
                    <div class="preview">
                        <h4>Fonctionnalités Calibrations</h4>
                        <span>1 Article</span>
                    </div>
                    <ul class="summaryElement" id="helpCalibrate">
                        <li onclick="goToHelpPage(6, event)">Comment enregistrer une nouvelle calibration ?</label>
                    </ul>
                </div>  
                <div  class="helpSummary" onclick="unroll('helpConnexion', event)">
                    <div class="preview">
                        <h4>Fonctionnalités Connexion</h4>
                        <span>1 Article</span>
                    </div>
                    <ul class="summaryElement" id="helpConnexion">
                        <li onclick="goToHelpPage(7, event)">Comment se connecter avec les questions de sécurité ?</label>
                    </ul>
                </div>
            </div>
        </main>
    </body>
</html>
