<?php
header("Content-Type: application/json; charset=utf-8");

include_once __DIR__ . "/../include/database.php";
include_once __DIR__ . "/../include/reply.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // handle POST request

    $data = file_get_contents("php://input");
    $arguments = json_decode($data, true);

    if (!isset($arguments["password"]) || !is_string($arguments["password"])){
        replyError("Impossible de définir le mot de passe", "Le mot de passe n'a pas été renseigné ou son format est incorrect. Veuillez le renseigner.");
    }

    reply(array(
        "success" => setParametersPHP($interval, $arguments["enableAutoRemove"])
    ));
    
} else {
    replyError("Impossible de sauvegarder les paramètres", "La méthode de requête est incorrecte.");
}