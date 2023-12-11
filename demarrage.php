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
                <div class="progression_bar_container">
                    <div class="progression_bar"></div>
                </div>
                <div class="popup_contenu">
                    <h2>Bienvenu(e) !</h2>
                    <p>
                        Bienvenu(e) dans l’assistant de configuration de votre système de mesure. 
                        Il semblerait que ça soit la première fois que le système démarre ou qu’il a été réinitialisé.
                        Avant de commencer à pouvoir l’utiliser, nous devons d’abord vous demander quelques informations.
                    </p>

                    <a href="setup_time.php">
                        <div class="rect_round_btn">
                            <p>Continuer</p>
                        </div>
                    </a>
                    <button class="rect_round_btn" type="button" onclick="setParameter()">
                        Continuer
                    </button>

                </div>
            </div>
        </main>
    </body>
</html>