<?php 
header("Content-Type: application/json");

include_once __DIR__ . "/../include/database.php";
include_once __DIR__ . "/../include/reply.php";

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // handle GET request
    reply(array(
        "data" => getCampaign()
    ));
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // handle POST request
    if (isset($_POST["filter"]) && !empty($_POST["filter"])){
        reply(array(
            "data" => getCampaign($_POST["filter"])
        ));
    }
} else {
    replyError("Impossible de récupérer les campagnes", "La méthode de requête est incorrecte.");
}