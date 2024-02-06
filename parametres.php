<?php include "include/checkSetup.php";?>
<!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="/css/style.css" rel="stylesheet">
        <script src="/js/functions.js"></script>
        <script src="/js/parametre.js"></script>

        <title>Page Paramètre</title>

        <link rel="preload" href="./img/error_ico.svg" as="image"/>
        <link rel="preload" href="./img/success_ico.svg" as="image"/>
    </head>
    <body class="bg main_theme">

        <!-- Navigation -->
        <?php include "modules/header.php";?>
        
        <main id="main_paramètre">
            <h2>Suppression des données</h2>
            
            <div class="checkbox">
                <label for="auto_suppr">
                    <input type="checkbox" id="auto_suppr" name="activateAutoSuppr" autocomplete="off">
                    <span class="cbx">
                        <svg width="12px" height="11px" viewBox="0 0 12 11">
                        <polyline points="1 6.29411765 4.5 10 11 1"></polyline>
                        </svg>
                    </span>
                    <span>Supprimer automatiquement les campagnes de mesures au bout d'un certains temps</span>
                    <?php include "include/checkSetup.php";?>
                </label>
            </div>

            <div class="label_img_input">
                <label class="label_field" for="conserv">Durée de conservation d'une campagne</label>
                <div class="row_fields">
                    <input class="input_field clock" id="conserv" name="conserv" type="number" placeholder="Durée" min="0" autocomplete="off" required>
                    <select id="comboBoxTpsSuppr" class="combo_box">
                        <option selected value="h">h</option>
                        <option value="j">j</option>
                        <option value="mois">mois</option>
                    </select>
                </div>
            </div>

            <div class="label_img_input">
                <label class="label_field" for="network">Nom du WIFI</label>
                <input class="input_field edit" id="network" name="network" type="text" placeholder="nom" min="0" autocomplete="off">
            </div>

            <div class="label_img_input">
                <label class="label_field" for="conserv">Altitude</label>
                <div class="row_fields">
                    <input class="input_field edit" id="altitude" name="altitude" type="number" placeholder="nombre entier" min="0" autocomplete="off">
                </div>
            </div>

            <button class="rect_round_btn gray bottom_gap" type="button" onclick="postParametre()">Enregistrer</button>
            <button class="rect_round_btn destructive" type="button" onclick="postDeleteAll()">Effacer les données</button>
        </main>

        <!-- loading popup -->
        <?php include "modules/loading_popup_displayed.php";?>
    </body>
</html>