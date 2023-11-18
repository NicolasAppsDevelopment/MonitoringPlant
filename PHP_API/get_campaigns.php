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
    if (isset($_POST["filter"]) && !empty($_POST["filter"])){
        reply(array(
            "data" => getListCampaign($_POST["filter"])
        ));
    }
} else {
    replyError("Impossible de récupérer les campagnes", "La méthode de requête est incorrecte.");
}