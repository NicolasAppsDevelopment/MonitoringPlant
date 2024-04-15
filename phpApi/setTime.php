<?php

/**
 * @file
 * Transmit the tet the date and time of the measurement device request to the Node.JS API with the Node.JS/PHP token.
 *
 * @URL /phpApi/setTime.php
 * @METHOD POST
 * @CONTENT-TYPE application/json
 * @BODY { "datetime": string }
 *      - datetime : The date and time to set in the format "YYYY-MM-DD HH:MM:SS".
 * @RETURNS { "success": true } with 200 error code if the date and time have been set successfully.
 */

include_once '../include/NodeJsApi.php';
include_once '../include/RequestReplySender.php';

$reply = RequestReplySender::getInstance();
$errorTitle = "Impossible de paramétrer l'heure";

try { 
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // handle POST request

        $data = file_get_contents("php://input");
        $arguments = json_decode($data, true);

        if (!isset($arguments["datetime"])){
            throw new Exception("La date et/ou l'heure ne sont pas renseignés");
        }

        if (!is_string($arguments["datetime"])){
            throw new Exception("Le format de la date renseignée est incorrect. Veuillez réessayer.");
        }

        nodeJsPost("setDatetime", array('datetime' => $arguments["datetime"]));

        $reply->replySuccess();
    } else {
        throw new Exception("La méthode de requête est incorrecte.");
    }
} catch (\Throwable $th) {
    $reply->replyError($errorTitle, $th);
}
