<?php

include_once '../include/Session.php';
include_once '../include/RequestReplySender.php';

$reply = RequestReplySender::getInstance();
$errorTitle = "Impossible de se connecter";

try {
    $session = Session::getInstance();
    
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // handle POST request

        $data = file_get_contents("php://input");
        $arguments = json_decode($data, true);

        if (!isset($arguments["password"]) || !is_string($arguments["password"])){
            throw new Exception("Le mot de passe n'a pas été renseigné ou son format est incorrecte. Veuillez le renseigner.");
        }

        if (!$session->login("admin", $arguments["password"])) {
            throw new Exception("Le mot de passe est incorrecte.");
        } else {
            $reply->replySuccess();
        }
    } else {
        throw new Exception("La méthode de requête est incorrecte.");
    }
} catch (\Throwable $th) {
    $reply->replyError($errorTitle, $th);
}
