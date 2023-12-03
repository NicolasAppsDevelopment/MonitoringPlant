<?php 
header("Content-Type: application/json; charset=utf-8");

include_once __DIR__ . "/../include/database.php";
include_once __DIR__ . "/../include/reply.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // handle POST request

    $data = file_get_contents("php://input");
	$args = json_decode($data, true);

    if (!isset($args["id"]) || empty($args["id"]) || !is_int($args["id"])) {
        replyError("Impossible d'accéder à la campagne", "L'identifiant de votre campagne n'a pas été renseigné ou son format est incorrecte. Veuillez donner l'identifiant de votre campagne puis réessayer.");
    }

    if (isset($args["last_log_datetime"]) && !is_string($args["datelast_log_datetime"])){
        replyError("Impossible d'accéder à la campagne", "Paramètre \"last_log_datetime\" est invalide dans la requête.");
    }

    if (!isset($args["last_log_datetime"])){
        $args["last_log_datetime"] = NULL;
    }

    if (isset($args["last_measure_datetime"]) && !is_string($args["last_measure_datetime"])){
        replyError("Impossible d'accéder à la campagne", "Paramètre \"last_measure_datetime\" est invalide dans la requête.");
    }

    if (!isset($args["last_measure_datetime"])){
        $args["last_measure_datetime"] = NULL;
    }

    $data = getCampaign($args["id"], $args["last_log_datetime"], $args["last_measure_datetime"]);

    // get last log datetime
    if (count($data["logs"]) > 0) {
        $data["last_log_datetime"] = $data["logs"][count($data["logs"])-1]["occuredDate"];
    } else{
        $data["last_log_datetime"] = NULL;
    } 
    
    // get last measure datetime
    if (count($data["measurements"]) > 0) {
        $data["last_measure_datetime"] = $data["measurements"][count($data["measurements"])-1]["date"];
    } else{
        $data["last_measure_datetime"] = NULL;
    }
    
    reply($data);
} else {
    replyError("Impossible d'accéder à la campagne", "La méthode de requête est incorrecte.");
}