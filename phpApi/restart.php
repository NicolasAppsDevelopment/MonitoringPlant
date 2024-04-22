<?php

/**
 * @file
 * Transmit a restart command to the microcontroller with the Node.JS/PHP token.
 * Client must be an admin to perform this action.
 *
 * @URL /phpApi/restart.php
 * @METHOD GET
 * @CONTENT-TYPE application/json
 * @RETURNS No reply from the microcontroller (it will restart). Only an error if the user is not an admin or restart command failed.
 */

include_once '../include/NodeJsApi.php';
include_once '../include/Session.php';
include_once '../include/RequestReplySender.php';

$reply = RequestReplySender::getInstance();
$errorTitle = "Impossible de redémarrer le microcontrôleur";

try {
    $session = Session::getInstance();

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // handle GET request
        if (!$session->isAdmin()){
            throw new Exception("Cette action nécessite d'abord d'être identifié en tant qu'administrateur.");
        }

        nodeJsPost('restart', []);

        $reply->replySuccess();
    } else {
        throw new Exception("La méthode de requête est incorrecte.");
    }
} catch (\Throwable $th) {
    $reply->replyError($errorTitle, $th);
}
