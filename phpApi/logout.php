<?php

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
