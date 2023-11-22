<?php 
header("Content-Type: application/json; charset=utf-8");

include_once __DIR__ . "/../include/database.php";
include_once __DIR__ . "/../include/reply.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // handle POST request

    $data = file_get_contents("php://input");
	$args = json_decode($data, true);

    if (!isset($args["title"]) || empty($args["title"])){
        replyError("Impossible d'ajouter la campagne", "Le nom de votre campagne n'a pas été renseigné. Veuillez donner un nom à votre campagne puis réessayer.");
    }

    if (!isset($args["CO2_enabled"], $args["O2_enabled"], $args["temperature_enabled"], $args["luminosity_enabled"], $args["humidity_enabled"])){
        replyError("Impossible d'ajouter la campagne", "Il manque un ou plusieurs capteurs dans la requête.");
    }

    if (!is_bool($args["CO2_enabled"]) || !is_bool($args["O2_enabled"]) || !is_bool($args["temperature_enabled"]) || !is_bool($args["luminosity_enabled"]) || !is_bool($args["humidity_enabled"])){
        replyError("Impossible d'ajouter la campagne", "Le format de la liste des capteurs séléctionnés est incorrecte.");
    }

    if ($args["CO2_enabled"] == false && $args["O2_enabled"] == false && $args["temperature_enabled"] == false && $args["luminosity_enabled"] == false && $args["humidity_enabled"] == false){
        replyError("Impossible d'ajouter la campagne", "Aucun capteur n'a été séléctionné. Veillez séléctionner au moins un capteur puis réessayer.");
    }

    $duration = null;
    if (!isset($args["duration"]) || empty($args["duration"])){
        replyError("Impossible d'ajouter la campagne", "La durée de la campagne n'a pas été renseigné. Veuillez entrer un nombre entier positif puis réessayer.");
    }
    $duration = filter_var($args["duration"], FILTER_VALIDATE_INT);
    if ($duration === false) {
        replyError("Impossible d'ajouter la campagne", "Le format de la durée de la campagne est incorrecte. Veuillez entrer un nombre entier positif puis réessayer.");
    }

    $interval = null;
    if (!isset($args["interval"]) || empty($args["interval"])){
        replyError("Impossible d'ajouter la campagne", "L'intervalle de relevé de la campagne n'a pas été renseigné. Veuillez entrer un nombre entier positif puis réessayer.");
    }
    $interval = filter_var($args["interval"], FILTER_VALIDATE_INT);
    if ($interval === false) {
        replyError("Impossible d'ajouter la campagne", "Le format de l'intervalle de relève de la campagne est incorrecte. Veuillez entrer un nombre entier positif puis réessayer.");
    }

    $volume = null;
    if (isset($args["volume"]) && !empty($args["volume"])) {
        $volume = filter_var($args["volume"], FILTER_VALIDATE_FLOAT);
        if ($volume === false) {
            replyError("Impossible d'ajouter la campagne", "Le format du volume de la campagne est incorrecte. Veuillez entrer un nombre décimal positif puis réessayer.");
        }
    }

    if (!isset($args["volume_unit"], $args["interval_unit"], $args["duration_unit"]) || !is_string($args["volume_unit"]) || !is_string($args["interval_unit"]) || !is_string($args["duration_unit"])) {
        replyError("Impossible d'ajouter la campagne", "Le format d'une unité séléctionné est incorrecte ou manquante.");
    }

    if ($volume != null) {
        switch ($args["volume_unit"]) {
            case "mL":
                break;
            case "cL":
                $volume *= 10;
                break;
            default:
                replyError("Impossible d'ajouter la campagne", "L'unité du volume séléctionné est incorrecte.");
                break;
        }
    }

    switch ($args["interval_unit"]) {
        case "s":
            break;
        case "min":
            $interval *= 60;
            break;
        case "h":
            $interval *= 3600;
            break;
        case "j":
            $interval *= 86400;
            break;
        default:
            replyError("Impossible d'ajouter la campagne", "L'unité de l'intervalle séléctionné est incorrecte.");
            break;
    }

    switch ($args["duration_unit"]) {
        case "s":
            break;
        case "min":
            $duration *= 60;
            break;
        case "h":
            $duration *= 3600;
            break;
        case "j":
            $duration *= 86400;
            break;
        default:
            replyError("Impossible d'ajouter la campagne", "L'unité de la durée séléctionné est incorrecte.");
            break;
    }

    reply(array(
        "id" => addCampaign($args["title"], $args["temperature_enabled"], $args["CO2_enabled"], $args["O2_enabled"], $args["luminosity_enabled"], $args["humidity_enabled"], $interval, $volume, $duration)
    ));
} else {
    replyError("Impossible d'ajouter la campagne", "La méthode de requête est incorrecte.");
}