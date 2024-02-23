<?php 
header("Content-Type: application/json; charset=utf-8");

include_once __DIR__ . "/../include/database.php";
include_once __DIR__ . "/../include/reply.php";

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // handle GET request
    reply(array(
        "data" => getListConfiguration()
    ));
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // handle POST request

    $data = file_get_contents("php://input");
	$args = json_decode($data, true);

    if (!isset($args["name"]) || !is_string($args["name"])){
        replyError("Impossible de filtrer les configurations", "Paramètre \"name\" manquant/invalide dans la requête.");
    }
    
    reply(array(
        "data" => getListConfiguration(array(
            "name"=> $args["name"],
        ))
    ));
} else {
    replyError("Impossible de récupérer les campagnes", "La méthode de requête est incorrecte.");
}