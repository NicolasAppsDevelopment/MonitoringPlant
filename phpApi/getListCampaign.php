<?php

include_once '../include/CampaignsManager.php';
include_once '../include/RequestReplySender.php';

$reply = RequestReplySender::getInstance();
$errorTitle = "Impossible de lister les campagnes";

try {
    $campaignsManager = CampaignsManager::getInstance();
    
    // Recovery and transmission of all measurement campaigns..
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // handle GET request
        // Recovery and transmission of all measurement campaigns.
        $reply->replyData($campaignsManager->getListCampaign());
    }
    // Recovery and transmission of measurement campaigns according to filter.
    elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // handle POST request

        $data = file_get_contents("php://input");
        $args = json_decode($data, true);

        // Checking filter data.
        if (!isset($args["name"]) || !is_string($args["name"])){
            throw new Exception("Erreur lors du filtrage. Paramètre \"name\" manquant/invalide dans la requête.");
        }

        if (!isset($args["startTime"]) || !is_string($args["startTime"])){
            throw new Exception("Erreur lors du filtrage. Paramètre \"startTime\" manquant/invalide dans la requête.");
        }

        if (!isset($args["startDate"]) || !is_string($args["startDate"])){
            throw new Exception("Erreur lors du filtrage. Paramètre \"startDate\" manquant/invalide dans la requête.");
        }

        if (!isset($args["endTime"]) || !is_string($args["endTime"])){
            throw new Exception("Erreur lors du filtrage. Paramètre \"endTime\" manquant/invalide dans la requête.");
        }

        if (!isset($args["endDate"]) || !is_string($args["endDate"])){
            throw new Exception("Erreur lors du filtrage. Paramètre \"endDate\" manquant/invalide dans la requête.");
        }

        if (!isset($args["processing"]) || !is_bool($args["processing"])){
            throw new Exception("Erreur lors du filtrage. Paramètre \"processing\" manquant/invalide dans la requête.");
        }

        if (!isset($args["success"]) || !is_bool($args["success"])){
            throw new Exception("Erreur lors du filtrage. Paramètre \"success\" manquant/invalide dans la requête.");
        }

        if (!isset($args["error"]) || !is_bool($args["error"])){
            throw new Exception("Erreur lors du filtrage. Paramètre \"error\" manquant/invalide dans la requête.");
        }

        if (!isset($args["warn"]) || !is_bool($args["warn"])){
            throw new Exception("Erreur lors du filtrage. Paramètre \"warn\" manquant/invalide dans la requête.");
        }
        
        // Recovery and transmission of measurement campaigns according to filter.
        $reply->replyData($campaignsManager->getListCampaign([
                "name"=> $args["name"],
                "startTime"=>$args["startTime"],
                "startDate"=>$args["startDate"],
                "endTime"=>$args["endTime"],
                "endDate"=>$args["endDate"],
                "processing"=>$args["processing"],
                "success"=>$args["success"],
                "error"=>$args["error"],
                "warn"=>$args["warn"]
            ])
        );
    } else {
        throw new Exception("La méthode de requête est incorrecte.");
    }
} catch (\Throwable $th) {
    $reply->replyError($errorTitle, $th);
}
