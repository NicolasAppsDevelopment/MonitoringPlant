<?php
header("Content-Type: application/json; charset=utf-8");

include_once __DIR__ . "/../include/reply.php";
include_once __DIR__ . "/../include/session.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // handle POST request

    $data = file_get_contents("php://input");
    $arguments = json_decode($data, true);

    if (!isset($arguments["question1"]) || !is_string($arguments["question1"])){
        replyError("Impossible d'enregistrer la première question", "La question n'a pas été renseigné ou son format est incorrect. Veuillez le renseigner.");
    }
    if (!isset($arguments["response1"]) || !is_string($arguments["response1"])){
        replyError("Impossible d'enregistrer la première réponse", "La réponse n'a pas été renseigné ou son format est incorrect. Veuillez le renseigner.");
    }
    if (!isset($arguments["question2"]) || !is_string($arguments["question2"])){
        replyError("Impossible d'enregistrer la deuxième question", "La question n'a pas été renseigné ou son format est incorrect. Veuillez le renseigner.");
    }
    if (!isset($arguments["response2"]) || !is_string($arguments["response2"])){
        replyError("Impossible d'enregistrer la deuxième réponse", "La réponse n'a pas été renseigné ou son format est incorrect. Veuillez le renseigner.");
    }
    if (!isset($arguments["question3"]) || !is_string($arguments["question3"])){
        replyError("Impossible d'enregistrer la troisième question", "La question n'a pas été renseigné ou son format est incorrect. Veuillez le renseigner.");
    }
    if (!isset($arguments["response3"]) || !is_string($arguments["response3"])){
        replyError("Impossible d'enregistrer la troisième réponse", "La réponse n'a pas été renseigné ou son format est incorrect. Veuillez le renseigner.");
    }

    if (!isAdminDefined()) {
        // the first register for the admin
        reply(array(
            "success" => registerAdminQuestions($arguments["question1"],$arguments["response1"]),registerAdminQuestions($arguments["question2"],$arguments["response2"]),registerAdminQuestions($arguments["question3"],$arguments["response3"]),
            "redirect" => "setupTime.php"
        ));
    } else if (isAdmin()) {
        // admin want to change his password
        reply(array(
            "success" => updateAdminQuestions($arguments["question1"],$arguments["response1"],$arguments["question2"],$arguments["response2"],$arguments["question3"],$arguments["response3"]),
            "redirect" => "settings.php"
        ));
    } else {
        // naughty boy >:O
        replyError("Impossible de définir les questions et réponses de sécurité", "Veuillez vous identifier avant de modifier les questions et réponses de sécurité.");
    } 
} else {
    replyError("Impossible de définir les questions et réponses de sécurité", "La méthode de requête est incorrecte.");
}