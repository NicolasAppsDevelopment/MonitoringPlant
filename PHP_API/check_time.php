<?php

include_once __DIR__ . "/../include/reply.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // handle POST request

    $data = file_get_contents("php://input");
	$args = json_decode($data, true);

    if (!isset($args["client_datetime"])){
        replyError("Impossible de vérifier la date & heure de la cellule", "La date et l'heure de votre appareil sont indéfinis. Veuillez rechagez la page.");
    }

    if (!is_string($args["client_datetime"])){
        replyError("Impossible de vérifier la date & heure de la cellule", "Le format de la date et de l'heure de votre appareil sont incorrectes. Veuillez rechagez la page.");
    }

    $client_datetime = strtotime($args["client_datetime"]);
    if ($client_datetime === false) {
        replyError("Impossible de vérifier la date & heure de la cellule", "Le format de la date et de l'heure de votre appareil sont incorrectes. Veuillez rechagez la page.");
    }

    $server_datetime = time();
    $timeout = 120; // in seconds

    reply([
        "up_to_date" => abs($client_datetime - $server_datetime) < $timeout
    ]);
} else {
    replyError("Impossible de vérifier la date & heure de la cellule", "La méthode de requête est incorrecte.");
}
?>