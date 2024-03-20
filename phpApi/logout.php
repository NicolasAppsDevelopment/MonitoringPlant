<?php

use Session;
use RequestReplySender;

$reply = RequestReplySender::getInstance();
$session = Session::getInstance();
$errorTitle = "Impossible de se déconnecter";

try {
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
