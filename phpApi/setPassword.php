<?php

include_once '../include/Session.php';
include_once '../include/SettingsManager.php';
include_once '../include/RequestReplySender.php';

$reply = RequestReplySender::getInstance();
$session = Session::getInstance();
$settingsManager = SettingsManager::getInstance();
$errorTitle = "Impossible de définir le mot de passe";
$destination = array("redirect" => "index.php");

try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // handle POST request

        $data = file_get_contents("php://input");
        $arguments = json_decode($data, true);

        if (!isset($arguments["password"]) || !is_string($arguments["password"])){
            throw new Exception("Le mot de passe n'a pas été renseigné ou son format est incorrect. Veuillez le renseigner.");
        }

        if (!$session->isAdminDefined()) {
            // the first register for the admin
            $session->registerAdmin($arguments["password"]);
            $destination["redirect"] = "setSecurityQuestions.php";
            $reply->replyData($destination);
        } elseif ($session->isAdmin()) {
            // admin want to change his password
            $session->updateAdminPassword($arguments["password"]);
            $destination["redirect"] = "settings.php";
            $reply->replyData($destination);
        } else {
            throw new Exception("Veuillez vous identifier avant de modifier le mot de passe.");
        }
    } else {
        throw new Exception("La méthode de requête est incorrecte.");
    }
} catch (\Throwable $th) {
    $reply->replyError($errorTitle, $th);
}
