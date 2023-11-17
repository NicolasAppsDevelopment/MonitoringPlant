<?php 
header("Content-Type: application/json");

include_once __DIR__ . "/../include/database.php";
include_once __DIR__ . "/../include/reply.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // handle POST request

    $data = file_get_contents("php://input");
	$args = json_decode($data, true);

    if (!isset($args["title"], $args["CO2_enabled"], $args["O2_enabled"], $args["temperature_enabled"], $args["luminosity_enabled"], $args["humidity_enabled"], $args["duration"], $args["interval"])){
        replyError("Impossible d'ajouter la campagne", "Un champs obligatoire n'a pas été défini.");
    }  

    if (empty($args["title"]) || !is_bool($args["CO2_enabled"]) || !is_bool($args["O2_enabled"]) || !is_bool($args["temperature_enabled"]) || !is_bool($args["luminosity_enabled"]) || !is_bool($args["humidity_enabled"]) || !is_int($args["duration"]) || !is_int($args["interval"]) || (!is_float($args["volume"]) && isset($args["volume"]))){
        replyError("Impossible d'ajouter la campagne", "Un ou plusieurs champs n'est pas défini correctement.");
    }

    reply(array(
        "id" => addCampaign($args["title"], $args["temperature_enabled"], $args["CO2_enabled"], $args["O2_enabled"], $args["luminosity_enabled"], $args["humidity_enabled"], $args["interval"], $args["volume"], $args["duration"])
    ));
} else {
    replyError("Impossible d'ajouter la campagne", "La méthode de requête est incorrecte.");
}