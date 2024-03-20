<?php

use Session;
use RequestReplySender;

$reply = RequestReplySender::getInstance();
$session = Session::getInstance();
$errorTitle = "Impossible de redémarrer le microcontrôleur";

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // handle GET request
        if (!$session->isAdmin()){
            throw new Exception("Cette action nécessite d'abord d'être identifié en tant qu'administrateur.");
        }

        NodeRedPost('restart',array('key' =>"I_do_believe_I_am_on_fire"));

        $reply->replySuccess();
    } else {
        throw new Exception("La méthode de requête est incorrecte.");
    }
} catch (\Throwable $th) {
    $reply->replyError($errorTitle, $th);
}
