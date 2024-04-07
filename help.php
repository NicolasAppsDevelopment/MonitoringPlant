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
                            <span>Campagnes</span>
                        </button>
                    </li>
                    <li class="tablelist-item-container">
                        <button id="btn-settigns" class="tablelist-item-btn" onclick="showHelpPanel('settigns')">
                            <i class="tablelist-item-btn-ico settings"></i>
                            <span>Paramètres</span>
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
                            <span>Connexion</span>
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
                                Campagnes
                            </h4>
                            <span class="tab-pane-header-desc">Obtenez de l'aide sur la gestion des campagnes.</span>
                        </div>
                    </div>
                    <div>
                        <a class="help-question-card" onclick="goToHelpPage(0, event)">
                            <h2 class="help-question-card-title">
                                Comment créer une nouvelle campagne de mesure ?
                            </h2>
                        </a>
                        <a class="help-question-card" onclick="goToHelpPage(1, event)">
                            <h2 class="help-question-card-title">
                            Comment filtrer une campagne de mesure ?
                            </h2>
                        </a>
                        <a class="help-question-card" onclick="goToHelpPage(2, event)">
                            <h2 class="help-question-card-title">
                                Comment avoir mes mesures sur Excel ?
                            </h2>
                        </a>
                        <a class="help-question-card" onclick="goToHelpPage(3, event)">
                            <h2 class="help-question-card-title">
                                Comment redémmarer ma campagne ?
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
                                Paramètres
                            </h4>
                            <span class="tab-pane-header-desc">Obtenez de l'aide sur les paramètres de l'appareil.</span>
                        </div>
                    </div>
                    <div>
                        <a class="help-question-card" onclick="goToHelpPage(4, event)">
                            <h2 class="help-question-card-title">
                                Comment marche la suppression automatique ?
                            </h2>
                        </a>
                        <a class="help-question-card" onclick="goToHelpPage(5, event)">
                            <h2 class="help-question-card-title">
                                Comment changer le nom du Wi-Fi ?
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
                        <a class="help-question-card" onclick="goToHelpPage(6, event)">
                            <h2 class="help-question-card-title">
                                Comment enregistrer une nouvelle calibration ?
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
                                Connexion
                            </h4>
                            <span class="tab-pane-header-desc">Obtenez de l'aide sur la connexion à votre espace administrateur.</span>
                        </div>
                    </div>
                    <div>
                        <a class="help-question-card" onclick="goToHelpPage(7, event)">
                            <h2 class="help-question-card-title">
                                Comment se connecter avec les questions de sécurité ?
                            </h2>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </main>
</body>

</html>