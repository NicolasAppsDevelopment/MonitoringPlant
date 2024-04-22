<?php

/**
 * @file
 * Transmit the stop campaign request to the Node.JS API with the Node.JS/PHP token.
 *
 * @URL /phpApi/stopCampaign.php
 * @METHOD POST
 * @CONTENT-TYPE application/json
 * @BODY { "id": int }
 * @RETURNS { "success": true } with 200 error code if the campaign has been stopped successfully.
 */

include_once '../include/NodeJsApi.php';
include_once '../include/RequestReplySender.php';

$reply = RequestReplySender::getInstance();
$errorTitle = "Impossible d'arrêter la campagne";

try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // handle POST request

        $data = file_get_contents("php://input");
        $arguments = json_decode($data, true);

        if (!isset($arguments["id"])){
            throw new Exception("L'identifiant de la campagne n'est pas renseigné");
        }
        
        $id = filter_var($arguments["id"], FILTER_VALIDATE_INT);
        if ($id === false) {
            throw new Exception("Le format de l'identifiant de la campagne renseigné est incorrect. Veuillez réessayer.");
        }

        nodeJsPost("stopCampaign", array('id' => $id));

        $reply->replySuccess();
    } else {
        throw new Exception("La méthode de requête est incorrecte.");
    }
} catch (\Throwable $th) {
    $reply->replyError($errorTitle, $th);
}
