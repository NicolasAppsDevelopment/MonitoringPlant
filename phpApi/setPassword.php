<?php

/**
 * @file
 * Define the password for the admin.
 * Client must be an admin to perform this action.
 * If the admin is not defined, this action will register the admin.
 *
 * @URL /phpApi/setPassword.php
 * @METHOD POST
 * @CONTENT-TYPE application/json
 * @BODY { "password": string }
 * @RETURNS { "success" : true, data: { "redirect": string }} with 200 error code if the password is set.
 *       - redirect : the page to redirect to after the password is set.
 */

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

        if (strlen($arguments["password"]) < 8) {
            throw new Exception("Le mot de passe doit contenir au moins 8 caractères.");
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
