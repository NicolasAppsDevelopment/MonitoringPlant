<?php

include_once '../include/CampaignsManager.php';
include_once '../include/RequestReplySender.php';

$campaignsManager = CampaignsManager::getInstance();
$reply = RequestReplySender::getInstance();
$errorTitle = "Impossible de lister les campagnes";

try { 
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

        if (!isset($args["time"]) || !is_string($args["time"])){
            throw new Exception("Erreur lors du filtrage. Paramètre \"time\" manquant/invalide dans la requête.");
        }

        if (!isset($args["date"]) || !is_string($args["date"])){
            throw new Exception("Erreur lors du filtrage. Paramètre \"date\" manquant/invalide dans la requête.");
        }

        if (!isset($args["processing"]) || !is_bool($args["processing"])){
            throw new Exception("Erreur lors du filtrage. Paramètre \"processing\" manquant/invalide dans la requête.");
        }
        
        // Recovery and transmission of measurement campaigns according to filter.
        $reply->replyData($campaignsManager->getListCampaign([
                "name"=> $args["name"],
                "time"=>$args["time"],
                "date"=>$args["date"],
                "processing"=>$args["processing"]
            ])
        );
    } else {
        throw new Exception("La méthode de requête est incorrecte.");
    }
} catch (\Throwable $th) {
    $reply->replyError($errorTitle, $th);
}
