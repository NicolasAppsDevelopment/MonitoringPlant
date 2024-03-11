<?php
header("Content-Type: application/json; charset=utf-8");

include_once __DIR__ . "/../include/session.php";
initSession();

include_once __DIR__ . "/../include/database.php";
include_once __DIR__ . "/../include/reply.php";

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // handle GET request
    if (!isAdmin()){
        replyError("Impossible de récupérer les paramètres", "Cette action nécessite d'abord d'être identifié en tant qu'administrateur.");
    }

    reply(getParametersPHP());

} else {
    replyError("Impossible de récupérer les paramètres", "La méthode de requête est incorrecte.");
}
