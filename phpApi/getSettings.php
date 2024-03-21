<?php

include_once '../include/Session.php';
include_once '../include/SettingsManager.php';
include_once '../include/RequestReplySender.php';

$settingsManager = SettingsManager::getInstance();
$reply = RequestReplySender::getInstance();
$session = Session::getInstance();
$errorTitle = "Impossible de récupérer les paramètres";

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // handle GET request
        if (!$session->isAdmin()){
            throw new Exception("Cette action nécessite d'abord d'être identifié en tant qu'administrateur.");
        }

        $reply->replyData($settingsManager->getSettings());

    } else {
        throw new Exception("La méthode de requête est incorrecte.");
    }
} catch (\Throwable $th) {
    $reply->replyError($errorTitle, $th);
}
