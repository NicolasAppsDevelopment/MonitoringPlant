<?php
include_once __DIR__ . "/../include/reply.php";
include_once __DIR__ . "/../include/NodeRED_API.php";


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // handle POST request

    $data = file_get_contents("php://input");
	$arguments = json_decode($data, true);

    if (!isset($arguments["datetime"])){
        replyError("Impossible de paramétrer l'heure", "La date et/ou l'heure ne sont pas renseignés");
    }

    if (!is_string($arguments["datetime"])){
        replyError("Impossible de paramétrer l'heure", "Le format de la date renseignée est incorrecte. Veuillez réessayer.");
    }

    reply(
        NodeRedPost("set_datetime", $arguments)
    );

} else {
    replyError("Impossible d'exporter la campagne", "La méthode de requête est incorrecte.");
}
?>