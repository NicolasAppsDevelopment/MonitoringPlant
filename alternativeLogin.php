<?php
    include_once "include/checkSetup.php";
?>
<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link href="./css/style.css" rel="stylesheet">
    <script src="./js/popup.js"></script>
    <script src="./js/request.js"></script>
    <script src="./js/alternativeLogin.js"></script>

    <title>Se connecter</title>

    <link rel="preload" href="./img/error_ico.svg" as="image" />
</head>

<body class="bg_animated main_theme login">
    <main class="main_popup_container">
        <div class="main_popup">
            <div class="progression_bar_container">
                <div class="progression_bar"></div>
            </div>
            <div class="popup_contenu" id="div_page1">
                <h2>Espace administrateur 1/3</h2>
                <p>
                    Veuillez répondre à cette première question :
                </p>
                <div>
                    <p id="question1">
                        question 1
                    </p>
                    <div class="label_img_input no-margin-top">
                        <input class="input_field btn-show key" id="response1" name="response1" type="text" placeholder="Réponse" autocomplete="off" minlength="1">
                    </div>
                    <button class="rect_round_btn" type="button" onclick="goToForm2()">
                        Suivant
                    </button>
                </div>
            </div>
            <div class="popup_contenu hidden" id="div_page2">
                <h2>Espace administrateur 2/3</h2>
                <p>
                    Veuillez répondre à cette deuxième question :
                </p>
                <div>
                    <p id="question2">
                        question 2
                    </p>
                    <div class="label_img_input no-margin-top">
                        <input class="input_field btn-show key" id="response2" name="response2" type="text" placeholder="Réponse" autocomplete="off" minlength="1">
                    </div>
                    <div class="two_buttons">
                            <button class="rect_round_btn" type="button" onclick="goToForm1()">
                                Précédent
                            </button>
                            <button class="rect_round_btn" type="button" onclick="goToForm3()">
                                Suivant
                            </button>
                    </div>
                </div>
            </div>
            <div class="popup_contenu hidden" id="div_page3">
                <h2>Espace administrateur 3/3</h2>
                <p>
                    Veuillez répondre à cette troisième question :
                </p>
                <div>
                    <p id="question3">
                        question 3
                    </p>
                    <div class="label_img_input no-margin-top">
                        <input class="input_field btn-show key" id="response3" name="response3" type="text" placeholder="Réponse" autocomplete="off" minlength="1">
                    </div>
                    <div class="two_buttons">
                        <button class="rect_round_btn" type="button" onclick="goToForm2()">
                            Précédent
                        </button>
                        <button class="rect_round_btn" type="button" onclick="alternativeLogin()">
                            Se connecter
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- loading popup -->
    <?php include "modules/loadingPopupDisplayed.php"; ?>
</body>

</html>