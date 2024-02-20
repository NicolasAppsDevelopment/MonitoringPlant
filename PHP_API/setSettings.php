<?php
include_once __DIR__ . "/../include/database.php";
include_once __DIR__ . "/../include/reply.php";
include_once __DIR__ . "/../include/NodeRED_API.php";


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // handle POST request

    $data = file_get_contents("php://input");
    $arguments = json_decode($data, true);

    
    if (!isset($arguments["timeConservation"])){
        replyError("Impossible de sauvegarder les paramètres", "L'intervalle de suppression des campagnes n'a pas été renseigné. Veuillez la renseigner.");
    }
    if (!isset($arguments["timeConservationUnit"]) || !is_string($arguments["timeConservationUnit"])){
        replyError("Impossible de sauvegarder les paramètres", "L'unité de l'intervalle de suppression des campagnes n'a pas été renseigné ou son format est incorrect. Veuillez la renseigner.");
    }
    if (!isset($arguments["enableAutoRemove"]) || !is_bool($arguments["enableAutoRemove"])){
        replyError("Impossible de sauvegarder les paramètres", "L'état d'activation de la suppression automatique n'a pas été renseigné ou son format est incorrect. Veuillez le renseigner.");
    }
    if (!isset($arguments["network"]) || !is_string($arguments["network"])){
        replyError("Impossible de sauvegarder les paramètres", "Le nom du réseau WIFI n'a pas été renseigné ou son format est incorrect. Veuillez le renseigner.");
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

    if($arguments["network"]!=null && $arguments["network"]!=NodeRedGet("getAccessPoint")){
        if(strlen($arguments["network"])<=32 && strlen($arguments["network"])>0){
            if(preg_match("/^[a-zA-Z0-9\s-_]+$/",$arguments["network"])){
                NodeRedPost("setAccessPoint",array('network' => $arguments["network"]));
            }else{
                replyError("Impossible de sauvegarder les paramètres", "Des caractères spéciaux et interdits sont utilisés pour le nouveau nom du réseau. Veuillez renseigner un nom de réseau sans caractère spéciaux puis réessayez.");
            }    
        }else{
            replyError("Impossible de sauvegarder les paramètres", "Le nouveau nom du réseau dépasse 32 caractères ou ne contient aucun caractère. Veuillez renseigner un nom de réseau entre 1 et 32 caractères.");
        } 
    }

    reply(array(
        "success" => setParametersPHP($interval, $arguments["enableAutoRemove"])
    ));
    
} else {
    replyError("Impossible de sauvegarder les paramètres", "La méthode de requête est incorrecte.");
}