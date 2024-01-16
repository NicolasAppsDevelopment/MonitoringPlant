<?php 
header("Content-Type: application/json; charset=utf-8");

include_once __DIR__ . "/../include/database.php";
include_once __DIR__ . "/../include/reply.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // handle POST request

    $data = file_get_contents("php://input");
	$args = json_decode($data, true);

    if (!isset($args["key"])){
        replyError("Impossible de formater la base de données", "La clé de vérification n'a pas été récupérée ou définie");
    }
    if (!is_string($args["key"])){
        replyError("Impossible de formater la base de données", "Le format de la clé de vérification est incorrect");
    }

    reply(array(
        "data" => resetAll()
    ));
} else {
    replyError("Impossible d'effacer toute les données", "La méthode de requête est incorrecte.");
}