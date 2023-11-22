<?php 
header("Content-Type: application/json; charset=utf-8");

include_once __DIR__ . "/../include/database.php";
include_once __DIR__ . "/../include/reply.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // handle POST request

    $data = file_get_contents("php://input");
	$args = json_decode($data, true);

    if (!isset($args["id"]) || !is_int($args["id"])){
        replyError("Impossible d'exporter la campagne", "L'identifiant de la campagne n'a pas été renseigné ou son format est incorrecte. Veuillez rafraîchir la page puis réessayer.");
    }

    if (!isset($args["CO2_enabled"], $args["O2_enabled"], $args["temperature_enabled"], $args["luminosity_enabled"], $args["humidity_enabled"])){
        replyError("Impossible d'exporter la campagne", "Il manque un ou plusieurs capteurs dans la requête.");
    }

    if (!is_bool($args["CO2_enabled"]) || !is_bool($args["O2_enabled"]) || !is_bool($args["temperature_enabled"]) || !is_bool($args["luminosity_enabled"]) || !is_bool($args["humidity_enabled"])){
        replyError("Impossible d'exporter la campagne", "Le format de la liste des capteurs séléctionnés est incorrecte.");
    }

    if ($args["CO2_enabled"] == false && $args["O2_enabled"] == false && $args["temperature_enabled"] == false && $args["luminosity_enabled"] == false && $args["humidity_enabled"] == false){
        replyError("Impossible d'exporter la campagne", "Aucun capteur n'a été séléctionné. Veillez séléctionner au moins un capteur puis réessayer.");
    }

    if (!is_string($args["start"])){
        replyError("Impossible d'ajouter la campagne", "Le format de la date de début de la campagne est incorrecte. Veuillez 
        réessayer.");
    }

    if (!is_string($args["end"])){
        replyError("Impossible d'ajouter la campagne", "Le format de la date de fin volume de la campagne est incorrecte. Veuillez réessayer.");
    }

    reply(
        exportCampaign($args["id"],$args["temperature_enabled"],$args["CO2_enabled"],$args["O2_enabled"],$args["luminosity_enabled"], $args["humidity_enabled"],$args["start"],$args["end"])
    );

} else {
    replyError("Impossible d'exporter la campagne", "La méthode de requête est incorrecte.");
}
    
    
