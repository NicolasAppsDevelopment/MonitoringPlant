<?php

include_once '../include/Session.php';
include_once '../include/Database.php';
include_once '../include/RequestReplySender.php';

$reply = RequestReplySender::getInstance();
$errorTitle = "Impossible d'effacer toutes les données";

try {
    $db = Database::getInstance();
    $session = Session::getInstance();

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // handle POST request
        
        if (!$session->isAdmin()){
            throw new Exception("Cette action nécessite d'abord d'être identifié en tant qu'administrateur.");
        }

        $db->resetAll();

        $reply->replySuccess();
    } else {
        throw new Exception("La méthode de requête est incorrecte.");
    }
} catch (\Throwable $th) {
    $reply->replyError($errorTitle, $th);
}
