<?php
include_once __DIR__ . "/../include/database.php";
include_once __DIR__ . "/../include/reply.php";

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // handle GET request
    $data=getParametre();
    reply($data);

} else {
    replyError("Impossible de récupérer les paramètres", "La méthode de requête est incorrecte.");
}
