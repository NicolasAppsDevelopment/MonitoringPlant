<?php 
header("Content-Type: application/json; charset=utf-8");

include_once __DIR__ . "/../include/database.php";
include_once __DIR__ . "/../include/reply.php";

// Recovery measurement campaign data.
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // handle POST request

    $data = file_get_contents("php://input");
	$args = json_decode($data, true);

    // Checking measurement campaign data for recovery.
    if (!isset($args["id"])){
        replyError("Impossible d'accéder à la campagne", "L'identifiant de la campagne n'a pas été renseigné. Veuillez rafraîchir la page puis réessayer.");
    }
    $id = filter_var($args["id"], FILTER_VALIDATE_INT);
    if ($id === false) {
        replyError("Impossible d'accéder à la campagne", "Le format de l'identifiaant de la campagne est incorrecte. Veuillez rafraîchir la page puis réessayer.");
    }

    if (isset($args["last_log_datetime"]) && !is_string($args["last_log_datetime"])){
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

    // Recovery measurement campaign data.
    $data = getCampaign($id, $args["last_log_datetime"], $args["last_measure_datetime"]);


    // Get last log datetime
    if (count($data["logs"]) > 0) {
        $data["last_log_datetime"] = $data["logs"][count($data["logs"])-1]["occuredDate"];
    } else{
        $data["last_log_datetime"] = NULL;
    } 
    

    // Get last measure datetime
    if (count($data["measurements"]) > 0) {
        $data["last_measure_datetime"] = $data["measurements"][count($data["measurements"])-1]["date"];
    } else{
        $data["last_measure_datetime"] = NULL;
    }
    
    
    // Transmission of measurement campaign data.
    reply($data);
} else {
    replyError("Impossible d'accéder à la campagne", "La méthode de requête est incorrecte.");
}