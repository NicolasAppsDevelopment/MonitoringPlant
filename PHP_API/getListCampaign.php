<?php 
header("Content-Type: application/json; charset=utf-8");

include_once __DIR__ . "/../include/database.php";
include_once __DIR__ . "/../include/reply.php";

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // handle GET request
    reply(array(
        "data" => getListCampaign()
    ));
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // handle POST request

    $data = file_get_contents("php://input");
	$args = json_decode($data, true);

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