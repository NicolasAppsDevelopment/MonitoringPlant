<?php
include_once __DIR__ . "/../include/reply.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // handle POST request

    $data = file_get_contents("php://input");
	$args = json_decode($data, true);

    if (isset($args["time"])){
        replyError("Impossible de paramétrer l'heure", "La date et/ou l'heure ne sont pas renseignés");
    }

    if (!is_string($args["time"])){
        replyError("Impossible de paramétrer l'heure", "Le format de la date de fin volume de la campagne est incorrecte. Veuillez réessayer.");
    }

    //$date = strtotime($args["time"]);
    reply(
        $date
    );

} else {
    replyError("Impossible d'exporter la campagne", "La méthode de requête est incorrecte.");
}
?>