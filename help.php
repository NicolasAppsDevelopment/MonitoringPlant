<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link href="./css/style.css" rel="stylesheet">
    <title>Aide</title>
    <script src="./js/help.js"></script>

    <link rel="preload" href="./img/error_ico.svg" as="image" />
    <link rel="preload" href="./img/warning_ico.svg" as="image" />
</head>

<body class="bg main_theme">

    <!-- Navigation -->
    <?php include "modules/header.php"; ?>
    <main>
        <div class="row-help-container">
            <!-- Aside table of contents -->
            <div class="tablelist-container">
                <ul class="tablelist">
                    <li class="tablelist-item-container">
                        <button id="btn-campaigns" class="tablelist-item-btn active" onclick="showHelpPanel('campaigns')">
                            <i class="tablelist-item-btn-ico campaign"></i>
                            <span>Mesurer</span>
                        </button>
                    </li>
                    <li class="tablelist-item-container">
                        <button id="btn-settigns" class="tablelist-item-btn" onclick="showHelpPanel('settigns')">
                            <i class="tablelist-item-btn-ico settings"></i>
                            <span>Paramètrer</span>
                        </button>
                    </li>
                    <li class="tablelist-item-container">
                        <button id="btn-calibrations" class="tablelist-item-btn" onclick="showHelpPanel('calibrations', this)">
                            <i class="tablelist-item-btn-ico calibration"></i>
                            <span>Calibrations</span>
                        </button>
                    </li>
                    <li class="tablelist-item-container">
                        <button id="btn-login" class="tablelist-item-btn" onclick="showHelpPanel('login', this)">
                            <i class="tablelist-item-btn-ico login"></i>
                            <span>Se connecter</span>
                        </button>
                    </li>
                </ul>
            </div>

            <!-- Content -->
            <div class="tab-pane-container">
                <div class="tab-pane active" id="campaigns">
                    <div class="tab-pane-header">
                        <div>
                            <span class="tab-pane-header-ico-container">
                                <i class="tab-pane-header-ico campaign"></i>
                            </span>
                        </div>
                        <div>
                            <h4 class="tab-pane-header-title">
                                Mesurer
                            </h4>
                            <span class="tab-pane-header-desc">Obtenez de l'aide sur la gestion des mesures.</span>
                        </div>
                    </div>
                    <div>
                        <a class="help-question-card" onclick="goToHelpPage(4, event)">
                            <h2 class="help-question-card-title">
                                C'est quoi une campagne de mesures ?
                            </h2>
                        </a>
                        <a class="help-question-card" onclick="goToHelpPage(6, event)">
                            <h2 class="help-question-card-title">
                                Comment créer une nouvelle campagne de mesures ?
                            </h2>
                        </a>
                        <a class="help-question-card" onclick="goToHelpPage(17, event)">
                            <h2 class="help-question-card-title">
                                Comment supprimer une campagne de mesures ?
                            </h2>
                        </a>
                        <a class="help-question-card" onclick="goToHelpPage(9, event)">
                            <h2 class="help-question-card-title">
                                Comment rechercher une campagne de mesures précise ?
                            </h2>
                        </a>
                        <a class="help-question-card" onclick="goToHelpPage(11, event)">
                            <h2 class="help-question-card-title">
                                Comment télécharger mes mesures sur mon ordinateur ?
                            </h2>
                        </a>
                        <a class="help-question-card" onclick="goToHelpPage(18, event)">
                            <h2 class="help-question-card-title">
                                Comment arrêter mes mesures ?
                            </h2>
                        </a>
                        <a class="help-question-card" onclick="goToHelpPage(20, event)">
                            <h2 class="help-question-card-title">
                                Comment redémarrer mes mesures ?
                            </h2>
                        </a>
                        <a class="help-question-card" onclick="goToHelpPage(22, event)">
                            <h2 class="help-question-card-title">
                                Comment modifier les paramètres de ma campagne de mesures ?
                            </h2>
                        </a>
                        <a class="help-question-card" onclick="goToHelpPage(14, event)">
                            <h2 class="help-question-card-title">
                                Comment je peux voir les données (mesures, paramètres utilisés, ...) de ma campagne de mesures ?
                            </h2>
                        </a>
                        <a class="help-question-card" onclick="goToHelpPage(39, event)">
                            <h2 class="help-question-card-title">
                                Que dois-je faire si je n'arrive pas à faire mes mesures (erreurs, ...) ?
                            </h2>
                        </a>
                    </div>
                </div>

                <div class="tab-pane" id="settigns">
                    <div class="tab-pane-header">
                        <div>
                            <span class="tab-pane-header-ico-container">
                                <i class="tab-pane-header-ico settings"></i>
                            </span>
                        </div>
                        <div>
                            <h4 class="tab-pane-header-title">
                                Paramètrer
                            </h4>
                            <span class="tab-pane-header-desc">Obtenez de l'aide sur les paramètres de l'appareil.</span>
                        </div>
                    </div>
                    <div>
                        <a class="help-question-card" onclick="goToHelpPage(28, event)">
                            <h2 class="help-question-card-title">
                                Comment puis-je supprimer automatiquement les mesures après un certain temps ?
                            </h2>
                        </a>
                        <a class="help-question-card" onclick="goToHelpPage(29, event)">
                            <h2 class="help-question-card-title">
                                Comment puis-je modifier le nom ou le mot de passe du Wi-Fi de l'appareil ?
                            </h2>
                        </a>
                        <a class="help-question-card" onclick="goToHelpPage(34, event)">
                            <h2 class="help-question-card-title">
                                Comment puis-je modifier le mot de passe de mon espace administrateur ?
                            </h2>
                        </a>
                        <a class="help-question-card" onclick="goToHelpPage(32, event)">
                            <h2 class="help-question-card-title">
                                Comment puis-je modifier les questions de sécurité ?
                            </h2>
                        </a>
                        <a class="help-question-card" onclick="goToHelpPage(35, event)">
                            <h2 class="help-question-card-title">
                                Comment puis-je supprimer toutes les données et paramètres de mon appareil de mesure ?
                            </h2>
                        </a>
                    </div>
                </div>

                <div class="tab-pane" id="calibrations">
                    <div class="tab-pane-header">
                        <div>
                            <span class="tab-pane-header-ico-container">
                                <i class="tab-pane-header-ico calibration"></i>
                            </span>
                        </div>
                        <div>
                            <h4 class="tab-pane-header-title">
                                Calibrations
                            </h4>
                            <span class="tab-pane-header-desc">Obtenez de l'aide sur la gestion de vos calibrations.</span>
                        </div>
                    </div>
                    <div>
                        <a class="help-question-card" onclick="goToHelpPage(4, event)">
                            <h2 class="help-question-card-title">
                                C'est quoi une calibration, configuration de calibration, configuration ?
                            </h2>
                        </a>
                        <a class="help-question-card" onclick="goToHelpPage(25, event)">
                            <h2 class="help-question-card-title">
                                Comment enregistrer une nouvelle calibration ?
                            </h2>
                        </a>
                        <a class="help-question-card" onclick="goToHelpPage(25, event)">
                            <h2 class="help-question-card-title">
                                Comment modifier une calibration ?
                            </h2>
                        </a>
                        <a class="help-question-card" onclick="goToHelpPage(26, event)">
                            <h2 class="help-question-card-title">
                                Comment supprimer une calibration ?
                            </h2>
                        </a>
                    </div>
                </div>

                <div class="tab-pane" id="login">
                    <div class="tab-pane-header">
                        <div>
                            <span class="tab-pane-header-ico-container">
                                <i class="tab-pane-header-ico login"></i>
                            </span>
                        </div>
                        <div>
                            <h4 class="tab-pane-header-title">
                                Se connecter
                            </h4>
                            <span class="tab-pane-header-desc">Obtenez de l'aide sur la connexion à votre espace administrateur ou à l'appareil de mesure.</span>
                        </div>
                    </div>
                    <div>
                    <a class="help-question-card" onclick="goToHelpPage(37, event)">
                            <h2 class="help-question-card-title">
                                Comment puis-je me connecter à mon espace administrateur ?
                            </h2>
                        </a>
                        <a class="help-question-card" onclick="goToHelpPage(37, event)">
                            <h2 class="help-question-card-title">
                                Comment puis-je pour me connecter à mon espace administrateur si j'ai oublié mon mot de passe ?
                            </h2>
                        </a>
                        <a class="help-question-card" onclick="goToHelpPage(30, event)">
                            <h2 class="help-question-card-title">
                                Comment puis-je accéder à l'appareil de mesure ?
                            </h2>
                        </a>
                        <a class="help-question-card" onclick="goToHelpPage(30, event)">
                            <h2 class="help-question-card-title">
                                Comment puis-je me connecter via un code QR à l'appareil de mesure ?
                            </h2>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </main>
</body>

</html>