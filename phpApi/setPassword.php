<?php

include_once '../include/Session.php';
include_once '../include/RequestReplySender.php';

$reply = RequestReplySender::getInstance();
$errorTitle = "Impossible de définir le mot de passe";

try {
    $session = Session::getInstance();
    
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // handle POST request

        $data = file_get_contents("php://input");
        $arguments = json_decode($data, true);

        if (!isset($arguments["password"]) || !is_string($arguments["password"])){
            throw new Exception("Le mot de passe n'a pas été renseigné ou son format est incorrect. Veuillez le renseigner.");
        }

        if (!$session->isAdminDefined()) {
            // the first register for the admin
            $session->registerAdmin($arguments["password"]);

            $reply->replyData([
                "redirect" => "setupTime.php"
            ]);
        } elseif ($session->isAdmin()) {
            // admin want to change his password
            $session->updateAdminPassword($arguments["password"]);

            $reply->replyData([
                "redirect" => "settings.php"
            ]);
        } else {
            // naughty boy >:O
            throw new Exception("Veuillez vous identifier avant de modifier le mot de passe.");
        }
    } else {
        throw new Exception("La méthode de requête est incorrecte.");
    }
} catch (\Throwable $th) {
    $reply->replyError($errorTitle, $th);
}
