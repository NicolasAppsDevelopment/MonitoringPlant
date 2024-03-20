<?php
header("Content-Type: application/json; charset=utf-8");

include_once __DIR__ . "/../include/session.php";
initSession();

include_once __DIR__ . "/../include/reply.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    logout();
    reply(array(
        "success" => true,
    ));
} else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    logout();
    header("Location: /");
} else {
    replyError("Impossible de récupérer les paramètres", "La méthode de requête est incorrecte.");
}