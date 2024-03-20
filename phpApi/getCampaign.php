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

    if (isset($args["lastLogDatetime"]) && !is_string($args["lastLogDatetime"])){
        replyError("Impossible d'accéder à la campagne", "Paramètre \"lastLogDatetime\" est invalide dans la requête.");
    }

    if (!isset($args["lastLogDatetime"])){
        $args["lastLogDatetime"] = NULL;
    }

    if (isset($args["lastMeasureDatetime"]) && !is_string($args["lastMeasureDatetime"])){
        replyError("Impossible d'accéder à la campagne", "Paramètre \"lastMeasureDatetime\" est invalide dans la requête.");
    }

    if (!isset($args["lastMeasureDatetime"])){
        $args["lastMeasureDatetime"] = NULL;
    }

    // Recovery measurement campaign data.
    $data = getCampaign($id, $args["lastLogDatetime"], $args["lastMeasureDatetime"]);


    // Get last log datetime
    if (count($data["logs"]) > 0) {
        $data["lastLogDatetime"] = $data["logs"][count($data["logs"])-1]["occuredDate"];
    } else{
        $data["lastLogDatetime"] = NULL;
    } 
    

    // Get last measure datetime
    if (count($data["measurements"]) > 0) {
        $data["lastMeasureDatetime"] = $data["measurements"][count($data["measurements"])-1]["date"];
    } else{
        $data["lastMeasureDatetime"] = NULL;
    }
    
    
    // Transmission of measurement campaign data.
    reply($data);
} else {
    replyError("Impossible d'accéder à la campagne", "La méthode de requête est incorrecte.");
}