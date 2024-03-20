<?php

use RequestReplySender;

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

        NodeRedPost("stop_campaign", array('id' => $id,'key' =>"I_do_believe_I_am_on_fire"));

        $reply->replySuccess();
    } else {
        throw new Exception("La méthode de requête est incorrecte.");
    }
} catch (\Throwable $th) {
    $reply->replyError($errorTitle, $th);
}
