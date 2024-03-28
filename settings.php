<?php
    include_once "include/checkSetup.php";
?>
<!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="/css/style.css" rel="stylesheet">
        <script src="/js/functions.js"></script>
        <script src="/js/settings.js"></script>

        <title>Page Paramètre</title>

        <link rel="preload" href="./img/error_ico.svg" as="image"/>
        <link rel="preload" href="./img/success_ico.svg" as="image"/>
    </head>
    <body class="bg main_theme">

        <!-- Navigation -->
        <?php include "modules/header.php";?>
        
        <main id="main_paramètre">
            <div class="section_head_container">
                <h2 class="section_head">Suppression automatique</h2>
            </div>
            
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

            <div class="section_head_container">
                <h2 class="section_head">Point d'accès sans fil</h2>
            </div>

            <div class="label_img_input no-margin-top">
                <label class="label_field" for="network_ssid">Nom du WIFI</label>
                <input class="input_field edit" id="network_ssid" name="network_ssid" type="text" placeholder="Nom" autocomplete="off" minlength="1">
            </div>

            <label class="label_field" for="network_password">Mot de passe du WIFI</label>
            <div class="label_img_input no-margin-top password-input">
                <span class="btn-show-pass" id="btn-show-pass">
                  <i class="btn-eye btn-eye-show" onclick="displayHide(this, 'network_password')"></i>
                </span>
                <input class="input_field btn-show key" id="network_password" name="network_password" type="password" placeholder="Mot de passe" autocomplete="off" minlength="1">
            </div>

            <button class="rect_round_btn gray bottom_gap" type="button" onclick="setSettings()">Récupérer le QR code</button>

            <div class="section_head_container">
                <h2 class="section_head">Accès administrateur</h2>
            </div>
            <a class="rect_round_btn gray bottom_gap row_center" href="./setSecurityQuestions.php" >Refaire les questions de sécurités</a>
            <a class="rect_round_btn gray bottom_gap row_center" href="./setPassword.php">Modifier le mot de passe</a>

            <div class="section_head_container"></div>
            <button class="rect_round_btn gray bottom_gap" type="button" onclick="setSettings()">Enregistrer</button>
            <button class="rect_round_btn destructive bottom_gap" type="button" onclick="reset()">Effacer les données</button>
        </main>

        <!-- loading popup -->
        <?php include "modules/loadingPopupDisplayed.php";?>
    </body>
</html>