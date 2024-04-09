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
        <script src="./js/functions.js"></script>

        <title>Mode de connexion</title>

        <link rel="preload" href="./img/error_ico.svg" as="image"/>
    </head>
    <body class="bg_animated main_theme index">
        <main class="main_popup_container">
            <div class="main_popup">
                <div id=popup_index>
                    <div>
                        <h1 class="i_am">Je suis ...</h1>
                    </div>
                    <div id=>
                        <a href="./listCampaign.php">
                            <div class="log_option btn_student">
                                <div class="ico_log_btn_container">
                                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="5.72 22.9 160.57 137.65" class="ico_log_btn"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none"  font-size="none"  style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#1368ce" class="ico_fill"><path d="M17.2,22.93333c-3.1663,0.00032 -5.73302,2.56703 -5.73333,5.73333v13.05677c-3.41497,1.98528 -5.73333,5.63994 -5.73333,9.87656v80.52422c0,6.15187 4.90075,11.17534 11.04115,11.42187c27.6058,1.12409 47.49127,6.25781 58.68828,10.01094c1.79844,4.22575 5.94471,6.97084 10.53724,6.9763c4.5966,-0.00098 8.7484,-2.74681 10.54844,-6.9763c11.19868,-3.75235 31.07866,-8.87949 58.67708,-9.99974c6.1404,-0.25227 11.04114,-5.2812 11.04114,-11.43307v-80.52422c0,-4.23663 -2.31837,-7.89128 -5.73333,-9.87656v-13.05677c-0.00032,-3.1663 -2.56703,-5.73302 -5.73333,-5.73333c-26.22469,0 -43.92646,2.90992 -55.22812,5.9237c-9.15693,2.44185 -11.88385,4.31699 -13.57188,5.27422c-1.68803,-0.95723 -4.41494,-2.83237 -13.57188,-5.27422c-11.30167,-3.01378 -29.00343,-5.9237 -55.22812,-5.9237zM22.93333,34.71354c21.6834,0.44074 37.25884,2.75484 46.53854,5.22943c5.61862,1.4983 8.80314,2.73742 10.79479,3.65052v91.55417c-8.95722,-3.03776 -27.83556,-7.96336 -57.33333,-8.66719zM149.06667,34.71354v91.76693c-29.49777,0.70382 -48.37611,5.62943 -57.33333,8.66719v-91.55417c1.99165,-0.9131 5.17617,-2.15222 10.79479,-3.65052c9.2797,-2.47459 24.85514,-4.78869 46.53854,-5.22943z"></path></g></g></svg>
                                </div>
                                <div>
                                    <h3 class="log_btn_title">Un(e) élève</h3>
                                    <p class="log_btn_desc">Accédez directement à la liste des campagnes.</p>
                                </div>
                            </div>
                        </a>
                        <a href="./login.php">
                            <div class="log_option btn_teacher">
                                <div class="ico_log_btn_container">
                                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="44 20 172.07 208.07" class="ico_log_btn"><g class="ico_fill" fill="#E4183A" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none"  font-size="none"  style="mix-blend-mode: normal"><g fill="#04ac58" class="ico_fill" transform="scale(4,4)"><path d="M20,5c-2.766,0 -5,2.242 -5,5c0,2.758 2.234,5 5,5c2.766,0 5,-2.242 5,-5c0,-2.758 -2.234,-5 -5,-5zM35,7c-1.104,0 -2,0.896 -2,2v1h-4c-1.104,0 -2,0.896 -2,2c0,1.104 0.896,2 2,2h20c0.552,0 1,0.449 1,1v18c0,0.551 -0.448,1 -1,1h-18c-1.104,0 -2,0.896 -2,2c0,1.104 0.896,2 2,2h5.45703l4.60742,17.50781c0.237,0.898 1.04659,1.49219 1.93359,1.49219c0.168,0 0.34077,-0.02141 0.50977,-0.06641c1.069,-0.281 1.70578,-1.37536 1.42578,-2.44336l-4.33984,-16.49023h8.40625c2.757,0 5,-2.243 5,-5v-18c0,-2.757 -2.243,-5 -5,-5h-12v-1c0,-1.104 -0.896,-2 -2,-2zM20,17c-5.65,0 -9,4 -9,7v12c0,1.1 0.9,2 2,2h1v16.94922c0,1.132 0.91878,2.05078 2.05078,2.05078c1.092,0 1.99287,-0.85627 2.04688,-1.94727l0.80859,-17.05273h2.1875l0.80859,17.05273c0.054,1.091 0.95488,1.94727 2.04688,1.94727c1.132,0 2.05078,-0.91878 2.05078,-2.05078v-16.94922v-2v-11.16992c1.18102,0.76172 2.55025,1.64579 2.64648,1.70703c0.286,0.182 0.86866,0.46289 1.34766,0.46289c0.305,0 0.61053,-0.06894 0.89453,-0.21094l8,-4c0.989,-0.495 1.38853,-1.69559 0.89453,-2.68359c-0.494,-0.986 -1.69164,-1.38953 -2.68164,-0.89453l-6.78906,3.39453l-4.3125,-3.73242v-0.00391c-1.5,-1.11 -3.54,-1.86914 -6,-1.86914z"></path></g></g></svg>
                                </div>
                                <div>
                                    <h3 class="log_btn_title">Un(e) administrateur(ice)</h3>
                                    <p class="log_btn_desc">Connectez-vous en administrateur.</p>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </main>

        <!-- loading popup -->
        <?php include "modules/loadingPopup.php";?>
    </body>
</html>