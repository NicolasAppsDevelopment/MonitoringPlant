<?php 
header("Content-Type: application/json; charset=utf-8");

include_once __DIR__ . "/../include/database.php";
include_once __DIR__ . "/../include/reply.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // handle POST request

    $data = file_get_contents("php://input");
	$args = json_decode($data, true);

    if (!isset($args["id"])){
        replyError("Impossible de supprimer la campagne", "L'identifiant de la campagne n'a pas été renseigné. Veuillez rafraîchir la page puis réessayer.");
    }
    $id = filter_var($args["id"], FILTER_VALIDATE_INT);
    if ($id === false) {
        replyError("Impossible de supprimer la campagne", "Le format de l'identifiaant de la campagne est incorrecte. Veuillez rafraîchir la page puis réessayer.");
    }

    reply(array(
        "success" => restartCampaign($id)
    ));
} else {
    replyError("Impossible de supprimer le contenu de la campagne", "La méthode de requête est incorrecte.");
}