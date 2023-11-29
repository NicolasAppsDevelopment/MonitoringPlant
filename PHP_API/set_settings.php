<?php
include_once __DIR__ . "/../include/database.php";
include_once __DIR__ . "/../include/reply.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // handle POST request

    $data = file_get_contents("php://input");
    $args = json_decode($data, true);


    if (!isset($args["removeInterval"]) ){
        replyError("Impossible de sauvegarder les paramètres", "L'intervalle de suppression de votre campagne n'a pas été renseigné. Veuillez le renseignez.");
    }
    if (!isset($args["autoRemove"])){
        replyError("Impossible de sauvegarder les paramètres", "Une erreur à eu lieu lors de votre décision sur la suppression automatique des données. Veuillez réitérer votre décision.");
    }

    reply(postParametres($args['removeInterval'], $args['autoRemove'],$args['date'],$args['time']));
} else {
    replyError("Impossible de sauvegarder les paramètres", "La méthode de requête est incorrecte.");
}