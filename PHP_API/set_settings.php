<?php
include_once __DIR__ . "/../include/database.php";
include_once __DIR__ . "/../include/reply.php";
include_once __DIR__ . "/../include/NodeRED_API.php";


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // handle POST request

    $data = file_get_contents("php://input");
    $arguments = json_decode($data, true);

    if(!isset($arguments["altitude"]) || !is_int($arguments["altitude"])){
        replyError("Impossible de sauvegarder les paramètres", "L'altitude n'est pas défini ou son format est incorrect. Veuillez la renseignez.");
    }
    if (!isset($arguments["timeConservation"]) || !is_int($arguments["timeConservation"])){
        replyError("Impossible de sauvegarder les paramètres", "L'intervalle de suppression des campagnes n'a pas été renseigné ou son format est incorrect. Veuillez la renseigner.");
    }
    if (!isset($arguments["timeConservationUnit"]) || !is_string($arguments["timeConservationUnit"])){
        replyError("Impossible de sauvegarder les paramètres", "L'unité de l'intervalle de suppression des campagnes n'a pas été renseigné ou son format est incorrect. Veuillez la renseigner.");
    }
    if (!isset($arguments["enableAutoRemove"]) || !is_bool($arguments["enableAutoRemove"])){
        replyError("Impossible de sauvegarder les paramètres", "L'état d'activation de la suppression automatique n'a pas été renseigné ou son format est incorrect. Veuillez le renseigner.");
    }

    switch ($arguments["timeConservationUnit"]) {
        case "h":
            $arguments["timeConservation"] *= 3600;
            break;
        case "j":
            $arguments["timeConservation"] *= 86400;
            break;
        case "mois":
            $arguments["timeConservation"] *= 2592000;
            break;
        default:
            replyError("Impossible de sauvegarder les paramètres", "L'unité de l'intervalle séléctionné est incorrecte.");
            break;
    }

    NodeRedPost("altitude",array('altitude' => $arguments["altitude"]));

    reply(array(
        "success" => postParametres($arguments["timeConservation"], $arguments["enableAutoRemove"],$arguments["altitude"])
    ));
    
} else {
    replyError("Impossible de sauvegarder les paramètres", "La méthode de requête est incorrecte.");
}