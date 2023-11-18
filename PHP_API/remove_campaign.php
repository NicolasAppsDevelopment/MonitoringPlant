<?php 
header("Content-Type: application/json; charset=utf-8");

include_once __DIR__ . "/../include/database.php";
include_once __DIR__ . "/../include/reply.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // handle POST request

    $data = file_get_contents("php://input");
	$args = json_decode($data, true);

    if (!isset($args["id"]) || !is_int($args["id"])){
        replyError("Impossible de supprimer la campagne", "L'identifiant de la campagne n'a pas été renseigné ou son format est incorrecte. Veuillez rafraîchir la page puis réessayer.");
    }

    reply(array(
        "success" => supprCampagne($args["id"])
    ));
} else {
    replyError("Impossible de supprimer la campagne", "La méthode de requête est incorrecte.");
}