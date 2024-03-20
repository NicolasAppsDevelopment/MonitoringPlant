<?php

use Session;
use ConfigurationsManager;
use RequestReplySender;

$configManager = ConfigurationsManager::getInstance();
$reply = RequestReplySender::getInstance();
$session = Session::getInstance();
$errorTitle = "Impossible de supprimer la configuration";

try {
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
