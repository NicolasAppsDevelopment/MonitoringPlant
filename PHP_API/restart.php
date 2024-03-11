<?php
header("Content-Type: application/json; charset=utf-8");

include_once __DIR__ . "/../include/session.php";
initSession();

include_once __DIR__ . "/../include/database.php";
include_once __DIR__ . "/../include/reply.php";
include_once __DIR__ . "/../include/NodeRED_API.php";

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // handle GET request
    if (!isAdmin()){
        replyError("Impossible de redémarrer le microcontrôleur", "Cette action nécessite d'abord d'être identifié en tant qu'administrateur.");
    }

    reply(NodeRedPost('restart',array('key' =>"I_do_believe_I_am_on_fire")));
} else {
    replyError("Impossible de redémarrer le microcontrôleur", "La méthode de requête est incorrecte.");
}