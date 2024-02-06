<?php
include_once __DIR__ . "/../include/database.php";
include_once __DIR__ . "/../include/reply.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // handle POST request

    $settings = file_get_contents("php://input");
    $arguments = json_decode($settings, true);


    if (!isset($arguments["timeConservation"]) ){
        replyError("Impossible de sauvegarder les paramètres", "L'intervalle de suppression des campagnes n'a pas été renseigné. Veuillez la renseigner.");
    }
    if (!isset($arguments["timeConservationUnit"]) || !is_string($arguments["timeConservationUnit"])){
        replyError("Impossible de sauvegarder les paramètres", "L'unité de l'intervalle de suppression des campagnes n'a pas été renseigné ou son format est incorrecte. Veuillez la renseigner.");
    }
    if (!isset($arguments["enableAutoRemove"]) || !is_bool($arguments["enableAutoRemove"])){
        replyError("Impossible de sauvegarder les paramètres", "L'état d'activation de la suppression automatique n'a pas été renseigné ou son format est incorrecte. Veuillez la renseigner.");
    }

    $interval = filter_var($arguments["timeConservation"], FILTER_VALIDATE_INT);
    if ($interval === false) {
        replyError("Impossible de sauvegarder les paramètres", "Le format de l'intervalle de suppression des campagnes est incorrecte. Veuillez entrer un nombre entier positif puis réessayer.");
    }

    switch ($arguments["timeConservationUnit"]) {
        case "h":
            $interval *= 3600;
            break;
        case "j":
            $interval *= 86400;
            break;
        case "mois":
            $interval *= 2592000;
            break;
        default:
            replyError("Impossible de sauvegarder les paramètres", "L'unité de l'intervalle séléctionné est incorrecte.");
            break;
    }

    reply(postParametres($interval, $arguments["enableAutoRemove"]));
} else {
    replyError("Impossible de sauvegarder les paramètres", "La méthode de requête est incorrecte.");
}