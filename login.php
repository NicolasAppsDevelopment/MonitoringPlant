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
    <script src="./js/login.js"></script>

    <title>Se connecter</title>

    <link rel="preload" href="./img/error_ico.svg" as="image" />
</head>

<body class="bg_animated main_theme login">
    <main class="main_popup_container">
        <div class="main_popup">
            <div class="popup_contenu" id="div_page1">
                <h2>Espace administrateur</h2>
                <p>
                    Veuillez saisir votre mot de passe d'administrateur afin d'accéder à votre espace.
                </p>
                <div>
                    <div class="label_img_input no-margin-top password-input">
                        <span class="btn-show-pass" id="btn-show-pass">
                            <i class="btn-eye btn-eye-show" onclick="displayHide(this, 'password')"></i>
                        </span>
                        <input class="input_field btn-show key" id="password" name="password" type="password" placeholder="Mot de passe" autocomplete="off" minlength="1">
                    </div>
                    <div id="div_login_a">
                        <a href="./alternativeLogin.php">Mot de passe oublié ?</a>
                    </div>
                    <button class="rect_round_btn" type="button" onclick="login()">Se connecter</button>
                </div>
            </div>
        </div>
    </main>

    <!-- loading popup -->
    <?php include "modules/loadingPopup.php"; ?>
</body>

</html>