<?php 
header("Content-Type: application/json; charset=utf-8");

include_once __DIR__ . "/../include/database.php";
include_once __DIR__ . "/../include/reply.php";

// Recovery and transmission of all measurement campaigns..
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // handle GET request
    // Recovery and transmission of all measurement campaigns.
    reply(array(
        "data" => getListCampaign()
    ));
} 
// Recovery and transmission of measurement campaigns according to filter.
elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // handle POST request

    $data = file_get_contents("php://input");
	$args = json_decode($data, true);

    // Checking filter data.
    if (!isset($args["name"]) || !is_string($args["name"])){
        replyError("Impossible de filtrer les campagnes", "Paramètre \"name\" manquant/invalide dans la requête.");
    }

    if (!isset($args["time"]) || !is_string($args["time"])){
        replyError("Impossible de filtrer les campagnes", "Paramètre \"time\" manquant/invalide dans la requête.");
    }

    if (!isset($args["date"]) || !is_string($args["date"])){
        replyError("Impossible de filtrer les campagnes", "Paramètre \"date\" manquant/invalide dans la requête.");
    }

    if (!isset($args["processing"]) || !is_bool($args["processing"])){
        replyError("Impossible de filtrer les campagnes", "Paramètre \"processing\" manquant/invalide dans la requête.");
    }
    
    // Recovery and transmission of measurement campaigns according to filter.
    reply(array(
        "data" => getListCampaign(array(
            "name"=> $args["name"], 
            "time"=>$args["time"],
            "date"=>$args["date"],
            "processing"=>$args["processing"]
        ))
    ));
} else {
    replyError("Impossible de récupérer les campagnes", "La méthode de requête est incorrecte.");
}