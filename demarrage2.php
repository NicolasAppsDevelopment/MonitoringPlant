<!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="./css/style.css" rel="stylesheet">
        <script src="./js/function.js"></script>
        <title>Accueil</title>
    </head>
    <body class="bg_animated main_theme">
        <main class="main_popup_container">
            <div class="main_popup">
                <div class="progression_bar_container" id="page2">
                    <div class="progression_bar"></div>
                </div>
                <div class="popup_contenu">
                    <h2>Quelle heure est-il ?</h2>
                    <p>
                        À present, nous avons besoins de savoir la date et l’heure qu’il est actuellement afin que vous puissez par exemple savoir quand une campagne de mesure a été feur démarré.
                    </p>
                    <form action="index.php" enctype="multipart/form-data" method="post">
                        <div class="label_img_input">
                            <label class="label_field" for="interval">Date & heure actuelle</label>
                            <div class="row_fields gap">
                                <input class="input_field calendar" id="date" name="date" type="date" placeholder="Intervalle" required>
                                <input class="input_field clock" id="heure" name="heure" type="time" placeholder="Intervalle" required>
                            </div>
                        </div>
                        <div class="two_buttons">
                            <a href="demarrage1.php">
                                <div class="rect_round_btn">
                                    <p>Retour</p>
                                </div>
                            </a>


                            <button class="rect_round_btn" type="submit">Continuer</button>
                        </div> 
                    </form>
                </div>
            </div>
        </main>
    </body>
</html>