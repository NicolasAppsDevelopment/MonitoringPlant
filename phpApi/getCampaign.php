<?php

/**
 * @file
 * Get all the data of a measurement campaign (log, measurements, config, ...).
 *
 * @URL /phpApi/getCampaign.php
 * @METHOD POST
 * @CONTENT-TYPE application/json
 * @BODY { "id" : int, "lastLogDatetime" : string, "lastMeasureDatetime" : string }
 *     - id : The identifier of the measurement campaign.
 *     - lastLogDatetime : Date from where to get the logs. If not provided, all logs will be returned.
 *     - lastMeasureDatetime : Date from where to get the measurements. If not provided, all measurements will be returned.
 * @RETURNS { "id": int, "title": string, "description": string, "startDate": string, "endDate": string, "logs": [ { "id": int, "occuredDate": string, "message": string } ], "measurements": [ { "id": int, "date": string, "co2": float, "o2": float, "temperature": float, "luminosity": float, "humidity": float } ], "config": { "id": int, "name": string, "f1": float, "m": float, "dPhi1": float, "dPhi2": float, "dKSV1": float, "dKSV2": float, "cal0": float, "cal2nd": float, "t0": float, "t2nd": float, "pressure": int, "o2cal2nd": int, "altitude": int, "calibIsHumid": bool } } with 200 error code if the campaign has been added successfully.
 */

include_once '../include/CampaignsManager.php';
include_once '../include/RequestReplySender.php';

$reply = RequestReplySender::getInstance();
$errorTitle = "Impossible d'accéder à la campagne";

try {
    $campaignsManager = CampaignsManager::getInstance();
    
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
            throw new Exception("Le format de l'identifiant de la campagne est incorrecte. Veuillez rafraîchir la page puis réessayer.");
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
