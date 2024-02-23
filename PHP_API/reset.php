<?php 
header("Content-Type: application/json; charset=utf-8");

include_once __DIR__ . "/../include/database.php";
include_once __DIR__ . "/../include/reply.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // handle POST request
    reply(array(
        "data" => resetAll()
    ));
} else {
    replyError("Impossible d'effacer toute les données", "La méthode de requête est incorrecte.");
}