<?php
include_once __DIR__ . "/../include/reply.php";


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // handle POST request

    $data = file_get_contents("php://input");
	$arguments = json_decode($data, true);
    var_dump($arguments);

    if (isset($arguments["time"])){
        replyError("Impossible de paramétrer l'heure", "La date et/ou l'heure ne sont pas renseignés");
    }

    if (!is_string($arguments["time"])){
        replyError("Impossible de paramétrer l'heure", "Le format de la date renseignée est incorrecte. Veuillez réessayer.");
    }
    $data = NodeRedPost("/set_datetime", array($arguments));

    reply(
        true
    );

} else {
    replyError("Impossible d'exporter la campagne", "La méthode de requête est incorrecte.");
}
?>