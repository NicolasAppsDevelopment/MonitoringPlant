<?php
include_once __DIR__ . "/../include/database.php";
include_once __DIR__ . "/../include/reply.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // handle POST request

    $data = file_get_contents("php://input");
    $arguments = json_decode($data, true);


    if (!isset($arguments["autoremove.interval"]) ){
        replyError("Impossible de sauvegarder les paramètres", "L'intervalle de suppression des campagnes n'a pas été renseigné. Veuillez la renseigner.");
    }
    if (!isset($arguments["autoremove.interval_unit"]) || !is_string($arguments["autoremove.interval_unit"])){
        replyError("Impossible de sauvegarder les paramètres", "L'unité de l'intervalle de suppression des campagnes n'a pas été renseigné ou son format est incorrecte. Veuillez la renseigner.");
    }
    if (!isset($arguments["autoremove.enabled"]) || !is_bool($arguments["autoremove.enabled"])){
        replyError("Impossible de sauvegarder les paramètres", "L'état d'activation de la suppression automatique n'a pas été renseigné ou son format est incorrecte. Veuillez la renseigner.");
    }

    $interval = filter_var($arguments["autoremove.interval"], FILTER_VALIDATE_INT);
    if ($interval === false) {
        replyError("Impossible de sauvegarder les paramètres", "Le format de l'intervalle de suppression des campagnes est incorrecte. Veuillez entrer un nombre entier positif puis réessayer.");
    }

    switch ($arguments["autoremove.interval_unit"]) {
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

    reply(postParametres($interval, $arguments["autoremove.enabled"]));
} else {
    replyError("Impossible de sauvegarder les paramètres", "La méthode de requête est incorrecte.");
}