<!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="/css/style.css" rel="stylesheet">
        <script src="/js/functions.js"></script>
        <script src="/js/parametre.js"></script>
        <title>Accueil</title>
    </head>
    <body class="bg main_theme">
        <?php include "modules/header.php";?>
        <main id="main_paramètre">
            <h2>Suppression des données</h2>
            
                <div class="checkbox">
                    <label for="auto_suppr">
                    <input type="checkbox" id="auto_suppr" name="activateAutoSuppr">
                    <span class="cbx">
                        <svg width="12px" height="11px" viewBox="0 0 12 11">
                        <polyline points="1 6.29411765 4.5 10 11 1"></polyline>
                        </svg>
                    </span>
                    <span>Supprimer automatiquement les campagnes de mesures au bout d'un certains temps</span>
                    </label>
                </div>
                <div class="label_img_input">
                    <label class="label_field" for="conserv">Durée de conservation d'une campagne</label>
                    <div class="row_fields">
                        <input class="input_field clock" id="conserv" name="conserv" type="number" placeholder="Durée" min="0" required>
                        <select class="combo_box">
                            <option selected value="h">h</option>
                            <option value="j">j</option>
                            <option value="mois">mois</option>
                        </select>
                    </div>
                </div>

                <button class="rect_round_btn gray" type="submit" onclick="postParametre();">Enregistrer</button>

            <button class="rect_round_btn destructive" type="submit">Effacer les données</button>

        </main>
    </body>
</html>