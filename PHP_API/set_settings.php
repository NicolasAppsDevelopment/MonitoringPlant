<?php
include_once __DIR__ . "/../include/database.php";
include_once __DIR__ . "/../include/reply.php";
include_once __DIR__ . "/../include/NodeRED_API.php";


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // handle POST request

    $data = file_get_contents("php://input");
    $arguments = json_decode($data, true);

    if(!isset($arguments["altitude"])){
        replyError("Impossible de sauvegarder les paramètres", "L'altitude n'est pas défini. veuillez la renseignez.");
    }


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
    $url = "$NODE_RED_API_URL/altitude";

    $curl = curl_init($url);
    curl_setopt($curl, CURLOPT_POST, true);
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query(array('altitude' => $args["altitude"])));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);


    $res = curl_exec($curl);
    curl_close($curl);

    reply(postParametres($interval, $arguments["enableAutoRemove"],$arguments["altitude"]));
    


} else {
    replyError("Impossible de sauvegarder les paramètres", "La méthode de requête est incorrecte.");
}