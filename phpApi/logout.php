<?php

/**
 * @file
 * Disconnect a user from the application.
 *
 * @URL /phpApi/logout.php
 * @METHOD POST
 * @CONTENT-TYPE application/json
 * @BODY {}
 * @RETURNS { "success": true } with 200 error code if the disconnection is successful.
 */

include_once '../include/Session.php';
include_once '../include/RequestReplySender.php';

$reply = RequestReplySender::getInstance();
$errorTitle = "Impossible de se déconnecter";

try {
    $session = Session::getInstance();

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $session->logout();
        $reply->replySuccess();
    } elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $session->logout();
        header("Location: /");
    } else {
        throw new Exception("La méthode de requête est incorrecte.");
    }
} catch (\Throwable $th) {
    $reply->replyError($errorTitle, $th);
}
