<?php 
header("Content-Type: application/json; charset=utf-8");

include_once __DIR__ . "/../include/database.php";
include_once __DIR__ . "/../include/reply.php";

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // handle GET request

    $data = file_get_contents("php://input");
	$args = json_decode($data, true);

    reply(array(
        "success" => resetAll()
    ));
} else {
    replyError("Impossible d'effacer toute les données", "La méthode de requête est incorrecte.");
}