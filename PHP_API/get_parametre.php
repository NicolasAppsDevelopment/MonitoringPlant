<?php
include_once __DIR__ . "/../include/database.php";
include_once __DIR__ . "/../include/reply.php";
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // handle GET request
    reply(array(
        "data" => getParametre()
    ));

} else {
    replyError("Impossible de récupérer les Paramètres", "La méthode de requête est incorrecte.");
}

