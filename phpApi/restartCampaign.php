<?php

include_once '../include/CampaignsManager.php';
include_once '../include/RequestReplySender.php';
include_once '../include/NodeRED_API.php';

$campaignsManager = CampaignsManager::getInstance();
$reply = RequestReplySender::getInstance();
$errorTitle = "Impossible de redémarrer la campagne";

try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // handle POST request

        $data = file_get_contents("php://input");
        $args = json_decode($data, true);

        if (!isset($args["id"])){
            throw new Exception("L'identifiant de la campagne n'a pas été renseigné. Veuillez rafraîchir la page puis réessayer.");
        }
        $id = filter_var($args["id"], FILTER_VALIDATE_INT);
        if ($id === false) {
            throw new Exception("Le format de l'identifiant de la campagne est incorrecte. Veuillez rafraîchir la page puis réessayer.");
        }

        // check if a campaign is already running
        $data=NodeRedGet("check_working_campaign");

        if (!array_key_exists("idCurrent", $data)) {
            throw new Exception("Une erreur est survenue lors de la vérification de l'état de la campagne en cours d'exécution. Veuillez réessayer.");
        }
        if ($data["idCurrent"] != null && $data["idCurrent"] != $id) {
            throw new Exception("Une campagne est déjà en cours d'exécution. Veuillez attendre la fin de celle-ci ou arrêtez la puis réessayer.");
        }

        $campaignsManager->restartCampaign($id);
        NodeRedPost("redoCampaign",array("id" => $id,'key' => 'I_do_believe_I_am_on_fire'));

        $reply->replySuccess();
    } else {
        throw new Exception("La méthode de requête est incorrecte.");
    }
} catch (\Throwable $th) {
    $reply->replyError($errorTitle, $th);
}
