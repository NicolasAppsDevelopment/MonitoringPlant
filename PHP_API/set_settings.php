<?php
include_once __DIR__ . "/../include/database.php";
include_once __DIR__ . "/../include/reply.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // handle POST request

    $data = file_get_contents("php://input");
    $args = json_decode($data, true);

    if(!isset($args["altitude"])){
        replyError("Impossible de sauvegarder les paramètres", "L'altitude n'est pas défini. veuillez la renseignez.");
    }


    if (!isset($args["autoremove.interval"]) ){
        replyError("Impossible de sauvegarder les paramètres", "L'intervalle de suppression des campagnes n'a pas été renseigné. Veuillez la renseigner.");
    }
    if (!isset($args["autoremove.interval_unit"]) || !is_string($args["autoremove.interval_unit"])){
        replyError("Impossible de sauvegarder les paramètres", "L'unité de l'intervalle de suppression des campagnes n'a pas été renseigné ou son format est incorrecte. Veuillez la renseigner.");
    }
    if (!isset($args["autoremove.enabled"]) || !is_bool($args["autoremove.enabled"])){
        replyError("Impossible de sauvegarder les paramètres", "L'état d'activation de la suppression automatique n'a pas été renseigné ou son format est incorrecte. Veuillez la renseigner.");
    }

    $interval = filter_var($args["autoremove.interval"], FILTER_VALIDATE_INT);
    if ($interval === false) {
        replyError("Impossible de sauvegarder les paramètres", "Le format de l'intervalle de suppression des campagnes est incorrecte. Veuillez entrer un nombre entier positif puis réessayer.");
    }

    switch ($args["autoremove.interval_unit"]) {
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

    reply(postParametres($interval, $args["autoremove.enabled"],$args["altitude"]));
} else {
    replyError("Impossible de sauvegarder les paramètres", "La méthode de requête est incorrecte.");
}