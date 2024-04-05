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
        <script src="./js/setSecurityQuestions.js"></script>

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
                    <h2>Pense-bête ! 1/3</h2>
                    <p>
                        Afin que puissiez-vous connecter en administrateur même si vous avez oublié votre mot de passe, veuillez définir vos questions de sécurité et leurs réponses.
                    </p>
                    <div>
                        <div class="label_img_input no-margin-top ">
                            <input class="input_field btn-show edit" id="question1" name="question1" type="text" placeholder="Quel est le nom de votre premier animal de compagnie ?" autocomplete="off" minlength="1">
                        </div>
                        <div class="label_img_input no-margin-top">
                            <input class="input_field btn-show edit" id="response1" name="response1" type="text" placeholder="Médor" autocomplete="off" minlength="1">
                        </div>
                        <button class="rect_round_btn" type="button" onclick="goToForm2()">
                        Suivant
                        </button>
                    </div>
                </div>
                <div class="popup_contenu hidden" id="div_page2">
                    <h2>Pense-bête ! 2/3</h2>
                    <p>
                        Afin que puissiez-vous connecter en administrateur même si vous avez oublié votre mot de passe, veuillez définir vos questions de sécurité et leurs réponses.
                    </p>
                    <div>
                        <div class="label_img_input no-margin-top ">
                            <input class="input_field btn-show edit" id="question2" name="question2" type="text" placeholder="Quel est le nom de votre mère ?" autocomplete="off" minlength="1">
                        </div>
                        <div class="label_img_input no-margin-top">
                            <input class="input_field btn-show edit" id="response2" name="response2" type="text" placeholder="Sarah" autocomplete="off" minlength="1">
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
                    <h2>Pense-bête ! 3/3</h2>
                    <p>
                        Afin que puissiez-vous connecter en administrateur même si vous avez oublié votre mot de passe, veuillez définir vos questions de sécurité et leurs réponses.
                    </p>
                    <form>
                    <div class="label_img_input no-margin-top ">
                            <input class="input_field btn-show edit" id="question3" name="question3" type="text" placeholder="Quel est le nom de votre meilleur(e) ami(e) ?" autocomplete="off" minlength="1">
                        </div>
                        <div class="label_img_input no-margin-top">
                            <input class="input_field btn-show edit" id="response3" name="response3" type="text" placeholder="Martin" autocomplete="off" minlength="1">
                        </div>
                        <div class="two_buttons">
                            <button class="rect_round_btn" type="button" onclick="goToForm2()">
                                Précédent
                            </button>
                            <button class="rect_round_btn" type="button" onclick="setSecurityQuestions()">
                                Continuer
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>

        <!-- loading popup -->
        <?php include "modules/loadingPopup.php";?>
    </body>
</html>