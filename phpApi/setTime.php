<?php

use RequestReplySender;

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

        NodeRedPost("setDatetime", array('datetime' => $arguments["datetime"],'key' =>"I_do_believe_I_am_on_fire"));

        $reply->replySuccess();
    } else {
        throw new Exception("La méthode de requête est incorrecte.");
    }
} catch (\Throwable $th) {
    $reply->replyError($errorTitle, $th);
}
