<?php

/**
 * @file
 * Get the measurement device settings (with network settings from Node.JS API).
 * Client needs to be looged as an admin.
 *
 * @URL /phpApi/getSettings.php
 * @METHOD GET
 * @CONTENT-TYPE application/json
 * @RETURNS { "autoRemove": bool, "removeInterval": int, "ssid": string, "password": string } with 200 error code if the settings have been retrieved successfully.
 *      - removeInterval : The time interval for deleting campaigns.
 *      - autoRemove : The state of automatic deletion.
 *      - ssid : The name of the Wi-Fi network.
 *      - password : The password of the Wi-Fi network.
 */

include_once '../include/NodeJsApi.php';
include_once '../include/Session.php';
include_once '../include/SettingsManager.php';
include_once '../include/RequestReplySender.php';

$reply = RequestReplySender::getInstance();
$errorTitle = "Impossible de récupérer les paramètres";

try {
    $settingsManager = SettingsManager::getInstance();
    $session = Session::getInstance();

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // handle GET request
        if (!$session->isAdmin()){
            throw new Exception("Cette action nécessite d'abord d'être identifié en tant qu'administrateur.");
        }

        $data = $settingsManager->getSettings();
        $network = nodeJsGet("getAccessPoint")["data"];
        $data["ssid"] = $network["ssid"];
        $data["password"] = $network["password"];

        $reply->replyData($data);

    } else {
        throw new Exception("La méthode de requête est incorrecte.");
    }
} catch (\Throwable $th) {
    $reply->replyError($errorTitle, $th);
}
