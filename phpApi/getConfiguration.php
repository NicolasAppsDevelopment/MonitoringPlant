<?php

use ConfigurationsManager;
use RequestReplySender;

$configManager = ConfigurationsManager::getInstance();
$reply = RequestReplySender::getInstance();
$errorTitle = "Impossible de récupérer la configuration";

try {
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
