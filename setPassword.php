<?php
    include_once "include/checkSetup.php";
?>
<!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="./css/style.css" rel="stylesheet">
        <script src="./js/functions.js"></script>
        <script src="./js/setPassword.js"></script>

        <title>Définition du mot de passe</title>

        <link rel="preload" href="./img/error_ico.svg" as="image"/>
    </head>
    <body class="bg_animated main_theme">
        <main class="main_popup_container">
            <div class="main_popup">
                <div class="progression_bar_container">
                    <div class="progression_bar"></div>
                </div>
                <div class="popup_contenu" id="div_page1">
                    <h2>Sécurisons ça ! 1/2</h2>
                    <p>
                        Afin que vous seul puissiez modifier les paramètres, créer les configurations et supprimer les campagnes, veuillez définir votre mot de passe d'administrateur.
                    </p>
                    <div>
                        <div class="label_img_input no-margin-top password-input">
                            <span class="btn-show-pass" id="btn-show-pass">
                                <button class="btn-eye btn-eye-show" onclick="displayHide(this, 'password')"></button>
                            </span>
                            <input class="input_field btn-show key" id="password" name="password" type="password" placeholder="Mot de passe" autocomplete="off" minlength="8" required>
                        </div>
                        <button class="rect_round_btn" type="button" onclick="next()">
                            Continuer
                        </button>
                    </div>
                </div>
                <div class="popup_contenu hidden" id="div_page2">
                    <h2>Sécurisons ça ! 2/2</h2>
                    <p>
                        Assurons-nous que le mot de passe soit bien correct, veuillez confirmer votre mot de passe.
                    </p>
                    <div>
                        <div class="label_img_input no-margin-top password-input">
                            <span class="btn-show-pass" id="btn-show-pass">
                                <button class="btn-eye btn-eye-show" onclick="displayHide(this, 'confirm_password')"></button>
                            </span>
                            <input class="input_field btn-show key" id="confirm_password" name="confirm_password" type="password" placeholder="Mot de passe" autocomplete="off" minlength="8"  required>
                        </div>
                        <div class="two_buttons">
                            <button class="rect_round_btn" type="button" onclick="previous()">
                                Précédent
                            </button>
                            <button class="rect_round_btn" type="button" onclick="setPassword()">
                                Continuer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <!-- loading popup -->
        <?php include "modules/loadingPopup.php";?>
    </body>
</html>
