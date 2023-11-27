<?php 
/*header("Content-Type: application/json; charset=utf-8");

include_once __DIR__ . "/../include/database.php";
include_once __DIR__ . "/../include/reply.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // handle POST request

    $data = file_get_contents("php://input");
	$args = json_decode($data, true);

    if (!isset($args["id"]) || empty($args["id"])){
        replyError("Impossible de récupérer le dernier log", "L'identifiant de la campagne n'a pas été défini.");
    }
    if (!is_int($args["id"])){
        replyError("Impossible de récupérer le dernier log", "Le format de l'identifiant de la campagne est incorrect.");
    }

    reply(array(
        "data" => getLog($args["id"])
    ));
} else {
    replyError("Impossible d'ajouter la campagne", "La méthode de requête est incorrecte.");
}*/