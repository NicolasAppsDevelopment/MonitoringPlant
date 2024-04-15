<?php

/**
 * @file
 * Get the configuration data.
 *
 * @URL /phpApi/getConfiguration.php
 * @METHOD POST
 * @CONTENT-TYPE application/json
 * @BODY { "id" : int }
 *     - id : The configuration identifier.
 * @RETURNS { "id": int, "name": string, "f1": float, "m": float, "dPhi1": float, "dPhi2": float, "dKSV1": float, "dKSV2": float, "cal0": float, "cal2nd": float, "t0": float, "t2nd": float, "pressure": int, "o2cal2nd": int, "altitude": int, "calibIsHumid": bool } with 200 error code if the configuration has been added successfully.
 */

include_once '../include/ConfigurationsManager.php';
include_once '../include/RequestReplySender.php';

$reply = RequestReplySender::getInstance();
$errorTitle = "Impossible de récupérer la configuration";

try {
    $configManager = ConfigurationsManager::getInstance();
    
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // handle POST request

        $data = file_get_contents("php://input");
        $args = json_decode($data, true);

        if (!isset($args["id"])){
            throw new Exception("L'identifiant de la configuration n'a pas été renseigné. Veuillez rafraîchir la page puis réessayer.");
        }

        $id = filter_var($args["id"], FILTER_VALIDATE_INT);
        if ($id === false) {
            throw new Exception("Le format de l'identifiant de la configuration est incorrecte. Veuillez rafraîchir la page puis réessayer.");
        }

        $data = $configManager->getConfiguration($id);
        
        $reply->replyData($data);
    } else {
        throw new Exception("La méthode de requête est incorrecte.");
    }
} catch (\Throwable $th) {
    $reply->replyError($errorTitle, $th);
}
