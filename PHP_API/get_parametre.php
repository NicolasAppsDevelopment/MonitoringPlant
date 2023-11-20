<?php
include_once __DIR__ . "/../include/database.php";
include_once __DIR__ . "/../include/reply.php";

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // handle GET request
    $data=getParametre();
    reply($data);

}elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // handle POST request
    if (isset($_POST["filter"]) && !empty($_POST["filter"])){
        reply(array(
            "data" => getListCampaign($_POST["filter"])
        ));
    }
    
}else{
    replyError("Impossible de récupérer les Paramètres", "La méthode de requête est incorrecte.");
}