<!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="./css/style.css" rel="stylesheet">
        <title>Liste des campagnes</title>

        <link rel="preload" href="./img/error_ico.svg" as="image"/>
        <link rel="preload" href="./img/warning_ico.svg" as="image"/>
    </head>
    <body class="bg main_theme">

        <!-- Navigation -->
        <?php include "modules/header.php";?>
        <main>
            <!-- Search bar -->
            <input type="text" placeholder="Rechercher..." class="custom_search_bar" id="campaign_name_search_bar" onkeydown="handleKeyPressSearchBar(event)">
            <!-- List of Helps -->
            <div class="liste_CM" id="CM_container">
                <div class="loading_popup" id="loading_div">
                    <svg class="spinner" viewBox="0 0 50 50">
                        <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
                    </svg>
                    <p class="loading_msg">Récupération des aides...</p>
                </div>
            </div>

            <ul id="summary">
                <li class="helpSummary">
                    <h4>page Accueil</h4>
                    <ul>
                        <li>Suppression automatique</li>
                        <li>Changer mot de Passe wifi</li>
                    </ul>
                </li>
                <li class="helpSummary">
                    <h4>page Paramètre</h4>
                    <ul>
                        <li>Suppression automatique</li>
                        <li>Changer mot de Passe wifi</li>
                    </ul>
                </li>    
                <li class="helpSummary">
                    <h4>page Voir Releve</h4>
                    <ul>
                        <li>Suppression automatique</li>
                        <li>Changer mot de Passe wifi</li>
                    </ul>
                </li>    
                <li class="helpSummary">
                    <h4>page Calibration</h4>
                    <ul>
                        <li>Suppression automatique</li>
                        <li>Changer mot de Passe wifi</li>
                    </ul>
                </li>    
            
            </ul>
            

        </main>
    </body>
</html>
