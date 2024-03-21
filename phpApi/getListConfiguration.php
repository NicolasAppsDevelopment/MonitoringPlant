<?php

include_once '../include/ConfigurationsManager.php';
include_once '../include/RequestReplySender.php';

$configManager = ConfigurationsManager::getInstance();
$reply = RequestReplySender::getInstance();
$errorTitle = "Impossible de lister les configurations";

try {
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
