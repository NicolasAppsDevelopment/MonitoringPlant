<?php

use CampaignsManager;
use RequestReplySender;

$campaignsManager = CampaignsManager::getInstance();
$reply = RequestReplySender::getInstance();
$errorTitle = "Impossible d'accéder à la campagne";

try {
    // Recovery measurement campaign data.
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // handle POST request

        $data = file_get_contents("php://input");
        $args = json_decode($data, true);

        // Checking measurement campaign data for recovery.
        if (!isset($args["id"])){
            throw new Exception("L'identifiant de la campagne n'a pas été renseigné. Veuillez rafraîchir la page puis réessayer.");
        }
        $id = filter_var($args["id"], FILTER_VALIDATE_INT);
        if ($id === false) {
            throw new Exception("Le format de l'identifiaant de la campagne est incorrecte. Veuillez rafraîchir la page puis réessayer.");
        }

        if (isset($args["lastLogDatetime"]) && !is_string($args["lastLogDatetime"])){
            throw new Exception("Paramètre \"lastLogDatetime\" est invalide dans la requête.");
        }

        if (!isset($args["lastLogDatetime"])){
            $args["lastLogDatetime"] = null;
        }

        if (isset($args["lastMeasureDatetime"]) && !is_string($args["lastMeasureDatetime"])){
            throw new Exception("Paramètre \"lastMeasureDatetime\" est invalide dans la requête.");
        }

        if (!isset($args["lastMeasureDatetime"])){
            $args["lastMeasureDatetime"] = null;
        }

        // Recovery measurement campaign data.
        $data = $campaignsManager->getCampaign($id, $args["lastLogDatetime"], $args["lastMeasureDatetime"]);

        // Get last log datetime
        if (count($data["logs"]) > 0) {
            $data["lastLogDatetime"] = $data["logs"][count($data["logs"])-1]["occuredDate"];
        } else{
            $data["lastLogDatetime"] = null;
        }

        // Get last measure datetime
        if (count($data["measurements"]) > 0) {
            $data["lastMeasureDatetime"] = $data["measurements"][count($data["measurements"])-1]["date"];
        } else{
            $data["lastMeasureDatetime"] = null;
        }
        
        // Transmission of measurement campaign data.
        $reply->replyData($data);
    } else {
        throw new Exception("La méthode de requête est incorrecte.");
    }
} catch (\Throwable $th) {
    $reply->replyError($errorTitle, $th);
}
