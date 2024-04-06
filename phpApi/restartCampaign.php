<?php

include_once '../include/ConfigManager.php';
include_once '../include/CampaignsManager.php';
include_once '../include/RequestReplySender.php';
include_once '../include/NodeJsApi.php';
include_once '../include/Session.php';

$reply = RequestReplySender::getInstance();
$errorTitle = "Impossible de redémarrer la campagne";

try {
    $session = Session::getInstance();
    $campaignsManager = CampaignsManager::getInstance();
    $configManager = ConfigurationsManager::getInstance();

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
        $data = nodeJsGet("checkWorkingCampaign");
        
        if (!array_key_exists("idCurrent", $data)) {
            throw new Exception("Une erreur est survenue lors de la vérification de l'état de la campagne en cours d'exécution. Veuillez réessayer.");
        }
        if ($data["idCurrent"] != null && $data["idCurrent"] != $id) {
            throw new Exception("Une campagne est déjà en cours d'exécution. Veuillez attendre la fin de celle-ci ou arrêtez la puis réessayer.");
        }

        // check if the configuration of the campaign still exists
        $infoCampaign = $campaignsManager->getInfoCampaign($id);
        if ($infoCampaign == null) {
            throw new Exception("La campagne n'existe pas. Veuillez rafraîchir la page puis réessayer.");
        }
        if ($infoCampaign["idConfig"] == null || !$configManager->existConfigurationById($infoCampaign["idConfig"])) {
            throw new Exception("La configuration de calibration de la campagne n'existe plus.");
        }

        // check permissions
        if ($infoCampaign["finished"] && !$session->isAdmin()){
            throw new Exception("Cette action nécessite d'abord d'être identifié en tant qu'administrateur.");
        }

        //$campaignsManager->restartCampaign($id);

        nodeJsPost("redoCampaign",array("id" => $id));

        $reply->replySuccess();
    } else {
        throw new Exception("La méthode de requête est incorrecte.");
    }
} catch (\Throwable $th) {
    $reply->replyError($errorTitle, $th);
}
