<?php 
header("Content-Type: application/json; charset=utf-8");

include_once __DIR__ . "/../include/database.php";
include_once __DIR__ . "/../include/reply.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // handle POST request

    $data = file_get_contents("php://input");
	$args = json_decode($data, true);

    if (!isset($args["id"])){
        replyError("Impossible de récupérer la configuration", "L'identifiant de la configuration n'a pas été renseigné. Veuillez rafraîchir la page puis réessayer.");
    }
    $id = filter_var($args["id"], FILTER_VALIDATE_INT);
    if ($id === false) {
        replyError("Impossible de récupérer la configuration", "Le format de l'identifiant de la configuration est incorrecte. Veuillez rafraîchir la page puis réessayer.");
    }

    $data = getConfiguration($id);
    
    reply($data);
} else {
    replyError("Impossible de récupérer la configuration", "La méthode de requête est incorrecte.");
}