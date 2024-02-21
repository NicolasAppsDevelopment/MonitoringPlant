<?php
header("Content-Type: application/json; charset=utf-8");

include_once __DIR__ . "/../include/database.php";
include_once __DIR__ . "/../include/reply.php";

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // handle GET request
    reply(getParametersPHP());

} else {
    replyError("Impossible de récupérer les paramètres", "La méthode de requête est incorrecte.");
}
