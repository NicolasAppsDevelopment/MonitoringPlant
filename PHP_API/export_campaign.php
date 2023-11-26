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

    if (isset($args["start_date"]) && !is_string($args["start_date"])){
        replyError("Impossible d'exporter la campagne", "Le format de la date de début de récupération des mesures de la campagne est incorrecte. Veuillez réessayer.");
    }

    if (isset($args["end_date"]) && !is_string($args["end_date"])){
        replyError("Impossible d'exporter la campagne", "Le format de la date de fin de récupération des mesures de la campagne est incorrecte. Veuillez réessayer.");
    }

    if (isset($args["start_time"]) && !is_string($args["start_time"])){
        replyError("Impossible d'exporter la campagne", "Le format de l'heure de début de récupération des mesures de la campagne est incorrecte. Veuillez réessayer.");
    }

    if (isset($args["end_time"]) && !is_string($args["end_time"])){
        replyError("Impossible d'exporter la campagne", "Le format de l'heure de fin de récupération des mesures de la campagne est incorrecte. Veuillez réessayer.");
    }

    if ((isset($args["start_time"]) && $args["end_date"] != "") && (!isset($args["start_date"]) || $args["start_date"] == "")){
        replyError("Impossible d'exporter la campagne", "Si vous spécifiez l'heure de début de récupération des mesures de la campagne vous devez aussi renseigner sa date. Veuillez réessayer.");
    }

    if ((isset($args["end_time"]) && $args["end_date"] != "") && (!isset($args["end_date"]) || $args["end_date"] == "")){
        replyError("Impossible d'exporter la campagne", "Si vous spécifiez la date de début de récupération des mesures de la campagne vous devez aussi renseigner sa date. Veuillez réessayer.");
    }

    if ((!isset($args["start_time"]) || $args["start_time"] == "") && isset($args["start_date"])){
        $args["start_time"] = "00:00:00";
    }

    if ((!isset($args["end_time"]) || $args["end_time"] == "") && isset($args["end_date"])){
        $args["end_time"] = "23:59:59";
    }

    $start = "";
    if (isset($args["start_time"]) && isset($args["start_date"]) && $args["start_date"] != "" && $args["start_time"] != ""){
        $start = $args["start_date"] . " " . $args["start_time"];
    }

    $end = "";
    if (isset($args["end_time"]) && isset($args["end_date"]) && $args["end_date"] != "" && $args["end_time"] != ""){
        $end = $args["end_date"] . " " . $args["end_time"];
    }

    $measurements=exportCampaign($args["id"], $args["temperature_enabled"], $args["CO2_enabled"], $args["O2_enabled"], $args["luminosity_enabled"], $args["humidity_enabled"], $start, $end);

    header('Content-Type: application/csv');
    header('Content-Disposition: attachment; filename="mesures_' . $args["id"] . '.csv"');

    // open the "output" stream
    $f = fopen('php://output', 'w');

    // send the column headers
    $headers = [];
    foreach ($measurements[0] as $key => $value) {
        if (is_string($key)) {
            array_push($headers, $key);
        }
    }
    fputcsv($f, $headers, ";");

    // output each row of the data
    foreach ($measurements as $line) {
        // remove the duplicate keys
        foreach ($line as $key => $value) {
            if (is_int($key)) {
                unset($line[$key]);
            }
        }

        fputcsv($f, $line, ";");
    }

    fclose($f);
} else {
    replyError("Impossible d'exporter la campagne", "La méthode de requête est incorrecte.");
}

?>
    
