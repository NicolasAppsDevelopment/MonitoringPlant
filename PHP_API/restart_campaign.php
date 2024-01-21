<?php 
header("Content-Type: application/json; charset=utf-8");

include_once __DIR__ . "/../include/database.php";
include_once __DIR__ . "/../include/reply.php";
include_once __DIR__ . "/../include/NodeRED_API.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // handle POST request

    $data = file_get_contents("php://input");
	$args = json_decode($data, true);

    if (!isset($args["id"])){
        replyError("Impossible de redémarrer la campagne", "L'identifiant de la campagne n'a pas été renseigné. Veuillez rafraîchir la page puis réessayer.");
    }
    $id = filter_var($args["id"], FILTER_VALIDATE_INT);
    if ($id === false) {
        replyError("Impossible de redémarrer la campagne", "Le format de l'identifiant de la campagne est incorrecte. Veuillez rafraîchir la page puis réessayer.");
    }

    // check if a campaign is already running
    $url = "$NODE_RED_API_URL/check_working_campaign";

    $curl = curl_init($url);
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

    $res = curl_exec($curl);
    $info = curl_getinfo($curl);
    curl_close($curl);

    if ($info["http_code"] != 200) {
        if ($info["http_code"] == 500) {
            replyError("Impossible de redémarrer la campagne", "Une campagne est déjà en cours d'exécution. Veuillez attendre la fin de celle-ci ou arrêtez la puis réessayer.");
        }
        replyError("Impossible de redémarrer la campagne", "Une erreur est survenue lors de la vérification de l'état de la campagne en cours d'exécution. Veuillez réessayer.");
    }

    reply(array(
        "success" => restartCampaign($id)
    ));
} else {
    replyError("Impossible de redémarrer la campagne", "La méthode de requête est incorrecte.");
}