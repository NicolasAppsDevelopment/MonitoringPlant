<?php

/**
 * @file
 * Remove a configuration from the database.
 * Client must be an admin to perform this action.
 *
 * @URL /phpApi/removeConfiguration.php
 * @METHOD POST
 * @CONTENT-TYPE application/json
 * @BODY { "id": int }
 *     - id : the identifier of the configuration to remove.
 * @RETURNS { "success": true } with 200 error code if the configuration has been removed successfully.
 */

include_once '../include/Session.php';
include_once '../include/ConfigurationsManager.php';
include_once '../include/RequestReplySender.php';

$reply = RequestReplySender::getInstance();
$errorTitle = "Impossible de supprimer la configuration";

try {
    $configManager = ConfigurationsManager::getInstance();
    $session = Session::getInstance();

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // handle POST request

        $data = file_get_contents("php://input");
        $args = json_decode($data, true);

        if (!$session->isAdmin()){
            throw new Exception("Cette action nécessite d'abord d'être identifié en tant qu'administrateur.");
        }

        if (!isset($args["id"])){
            throw new Exception("L'identifiant de la configuration n'a pas été renseigné. Veuillez rafraîchir la page puis réessayer.");
        }
        $id = filter_var($args["id"], FILTER_VALIDATE_INT);
        if ($id === false) {
            throw new Exception("Le format de l'identifiant de la configuration est incorrecte. Veuillez rafraîchir la page puis réessayer.");
        }

        $configManager->supprConfiguration($id);

        $reply->replySuccess();
    } else {
        throw new Exception("La méthode de requête est incorrecte.");
    }
} catch (\Throwable $th) {
    $reply->replyError($errorTitle, $th);
}
