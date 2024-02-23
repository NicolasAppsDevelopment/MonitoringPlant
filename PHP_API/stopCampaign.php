<?php
header("Content-Type: application/json; charset=utf-8");

include_once __DIR__ . "/../include/reply.php";
include_once __DIR__ . "/../include/NodeRED_API.php";


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // handle POST request

    $data = file_get_contents("php://input");
	$arguments = json_decode($data, true);

    if (!isset($arguments["id"])){
        replyError("Impossible d'arrêter la campagne'", "L'identifiant de la campagne n'est pas renseigné");
    }
    
    $id = filter_var($arguments["id"], FILTER_VALIDATE_INT);
    if ($id === false) {
        replyError("Impossible d'arrêter la campagne", "Le format de l'identifiant de la campagne renseigné est incorrect. Veuillez réessayer.");
    }

    reply(
        NodeRedPost("stop_campaign", array('id' => $id,'key' =>"I_do_believe_I_am_on_fire"))
    );

} else {
    replyError("Impossible d'exporter la campagne", "La méthode de requête est incorrecte.");
}