<?php

/**
 * @file
 * Get the security questions.
 *
 * @URL /phpApi/getSecurityQuestions.php
 * @METHOD GET
 * @CONTENT-TYPE application/json
 * @RETURNS { "question": string }[] with 200 error code if the security questions have been listed successfully.
 */

include_once '../include/SettingsManager.php';
include_once '../include/RequestReplySender.php';

$reply = RequestReplySender::getInstance();
$errorTitle = "Impossible de récupérer les questions de sécurité";

try {
    $settingsManager = SettingsManager::getInstance();

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // handle GET request
        $reply->replyData($settingsManager->getSecurityQuestions());
    } else {
        throw new Exception("La méthode de requête est incorrecte.");
    }
} catch (\Throwable $th) {
    $reply->replyError($errorTitle, $th);
}
