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
        replyError("Impossible de définir le mot de passe", "Le mot de passe n'a pas été renseigné ou son format est incorrect. Veuillez le renseigner.");
    }

    if (!isAdminDefined()) {
        // the first register for the admin
        reply(array(
            "success" => registerAdmin($arguments["password"]),
            "redirect" => "setupTime.php"
        ));
    } else if (isAdmin()) {
        // admin want to change his password
        reply(array(
            "success" => updateAdminPassword($arguments["password"]),
            "redirect" => "settings.php"
        ));
    } else {
        // naughty boy >:O
        replyError("Impossible de définir le mot de passe", "Veuillez vous identifier avant de modifier le mot de passe.");
    } 
} else {
    replyError("Impossible de définir le mot de passe", "La méthode de requête est incorrecte.");
}