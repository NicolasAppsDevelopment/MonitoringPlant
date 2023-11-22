<?php 
header("Content-Type: application/json; charset=utf-8");

include_once __DIR__ . "/../include/database.php";
include_once __DIR__ . "/../include/reply.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // handle POST request

    $data = file_get_contents("php://input");
	$args = json_decode($data, true);

    if (!isset($args["title"]) || !is_string($args["title"]) || empty($args["title"])){
        replyError("Impossible d'ajouter la campagne", "Le nom de votre campagne n'a pas été renseigné ou son format est incorrecte. Veuillez donner un nom à votre campagne puis réessayer.");
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

    if (!isset($args["duration"]) || !is_int($args["duration"])){
        replyError("Impossible d'ajouter la campagne", "La durée de la campagne n'a pas été renseigné ou son format est incorrecte. Veuillez entrer un nombre entier puis réessayer.");
    }

    if (!isset($args["interval"]) || !is_int($args["interval"])){
        replyError("Impossible d'ajouter la campagne", "L'intervalle de relevé de la campagne n'a pas été renseigné ou son format est incorrecte. Veuillez entrer un nombre entier puis réessayer.");
    }

    if (isset($args["volume"]) && !is_int($args["volume"]) && !is_float($args["volume"])){
        replyError("Impossible d'ajouter la campagne", "Le format du volume de la campagne est incorrecte. Veuillez entrer un nombre entier ou décimal puis réessayer.");
    }

    reply(array(
        "id" => addCampaign($args["title"], $args["temperature_enabled"], $args["CO2_enabled"], $args["O2_enabled"], $args["luminosity_enabled"], $args["humidity_enabled"], $args["interval"], $args["volume"], $args["duration"])
    ));
} else {
    replyError("Impossible d'ajouter la campagne", "La méthode de requête est incorrecte.");
}