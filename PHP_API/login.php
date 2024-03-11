<?php
header("Content-Type: application/json; charset=utf-8");

include_once __DIR__ . "/../include/session.php";
initSession();

include_once __DIR__ . "/../include/reply.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // handle POST request

    $data = file_get_contents("php://input");
    $arguments = json_decode($data, true);

    if (!isset($arguments["password"]) || !is_string($arguments["password"])){
        replyError("Impossible de se connecter", "Le mot de passe n'a pas été renseigné ou son format est incorrecte. Veuillez le renseigner.");
    }

    if (!login("admin", $arguments["password"])) {
        replyError("Impossible de se connecter", "Le mot de passe est incorrecte.");
    } else {
        reply(array(
            "success" => true,
        ));
    }
} else {
    replyError("Impossible de se connecter", "La méthode de requête est incorrecte.");
}