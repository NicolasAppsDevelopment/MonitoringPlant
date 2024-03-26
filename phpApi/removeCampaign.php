<?php

include_once '../include/CampaignsManager.php';
include_once '../include/Session.php';
include_once '../include/RequestReplySender.php';

$reply = RequestReplySender::getInstance();
$errorTitle = "Impossible de supprimer la campagne";

try {
    $campaignsManager = CampaignsManager::getInstance();
    $session = Session::getInstance();

    //Removes a measurement campaign.
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // handle POST request

        $data = file_get_contents("php://input");
        $args = json_decode($data, true);

        if (!$session->isAdmin()){
            throw new Exception("Cette action nécessite d'abord d'être identifié en tant qu'administrateur.");
        }

        // Checking the id.
        if (!isset($args["id"])){
            throw new Exception("L'identifiant de la campagne n'a pas été renseigné. Veuillez rafraîchir la page puis réessayer.");
        }
        $id = filter_var($args["id"], FILTER_VALIDATE_INT);
        if ($id === false) {
            throw new Exception("Le format de l'identifiant de la campagne est incorrecte. Veuillez rafraîchir la page puis réessayer.");
        }

        // Deletes all data of the campaign whose id is entered as a parameter.
        $campaignsManager->supprCampaign($id);

        $reply->replySuccess();
    } else {
        throw new Exception("La méthode de requête est incorrecte.");
    }
} catch (\Throwable $th) {
    $reply->replyError($errorTitle, $th);
}
