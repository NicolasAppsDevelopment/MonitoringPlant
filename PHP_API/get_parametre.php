<?php
include_once __DIR__ . "/../include/database.php";
include_once __DIR__ . "/../include/reply.php";

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // handle GET request
    $data=getParametre();
    reply($data);

}elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // handle POST request
    if (isset($_POST["active"]) && isset($_POST["IntervalSuppression"])){
        reply(array(
            postParametre($_POST["IntervalSuppression"], $_POST["active"])
        ));
    }
    
}else{
    replyError("Impossible de récupérer les Paramètres", "La méthode de requête est incorrecte.");
}