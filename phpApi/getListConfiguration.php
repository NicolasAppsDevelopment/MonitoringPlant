<?php

/**
 * @file
 * List all configurations (with a filter if needed use a POST request with the specific body).
 *
 * @URL /phpApi/getListConfiguration.php
 * @METHOD GET or POST
 * @CONTENT-TYPE application/json
 * BODY (only for a POST request) : { "name" : string }
 *   - name : The name of the searched configuration.
 * @RETURNS { "id": int, "name": string, "f1": float, "m": float, "dPhi1": float, "dPhi2": float, "dKSV1": float, "dKSV2": float, "cal0": float, "cal2nd": float, "t0": float, "t2nd": float, "pressure": int, "o2cal2nd": int, "altitude": int, "calibIsHumid": bool }[] with 200 error code if the configurations have been listed successfully.
 */

include_once '../include/ConfigurationsManager.php';
include_once '../include/RequestReplySender.php';

$reply = RequestReplySender::getInstance();
$errorTitle = "Impossible de lister les configurations";

try {
    $configManager = ConfigurationsManager::getInstance();
    
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // handle GET request
        $reply->replyData($configManager->getListConfiguration());
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // handle POST request

        $data = file_get_contents("php://input");
        $args = json_decode($data, true);

        if (!isset($args["name"]) || !is_string($args["name"])){
            throw new Exception("Paramètre \"name\" manquant/invalide dans la requête.");
        }
        
        $reply->replyData(
            $configManager->getListConfiguration([
                "name"=> $args["name"],
            ])
        );
    } else {
        throw new Exception("La méthode de requête est incorrecte.");
    }
} catch (\Throwable $th) {
    $reply->replyError($errorTitle, $th);
}
