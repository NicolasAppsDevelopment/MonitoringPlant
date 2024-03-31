<?php

include_once '../include/Session.php';
include_once '../include/SettingsManager.php';
include_once '../include/RequestReplySender.php';

$reply = RequestReplySender::getInstance();
$errorTitle = "Impossible de définir les questions/réponses de sécurité";

try {
    $settingsManager = SettingsManager::getInstance();
    $session = Session::getInstance();

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // handle POST request

        $data = file_get_contents("php://input");
        $arguments = json_decode($data, true);

        if (!isset($arguments["question1"]) || !is_string($arguments["question1"])){
            throw new Exception("Impossible d'enregistrer la première question. La question n'a pas été renseignée ou son format est incorrect. Veuillez la renseigner.");
        }
        if (!isset($arguments["response1"]) || !is_string($arguments["response1"])){
            throw new Exception("Impossible d'enregistrer la première réponse. La réponse n'a pas été renseignée ou son format est incorrect. Veuillez la renseigner.");
        }
        if (!isset($arguments["question2"]) || !is_string($arguments["question2"])){
            throw new Exception("Impossible d'enregistrer la deuxième question. La question n'a pas été renseignée ou son format est incorrect. Veuillez la renseigner.");
        }
        if (!isset($arguments["response2"]) || !is_string($arguments["response2"])){
            throw new Exception("Impossible d'enregistrer la deuxième réponse. La réponse n'a pas été renseignée ou son format est incorrect. Veuillez la renseigner.");
        }
        if (!isset($arguments["question3"]) || !is_string($arguments["question3"])){
            throw new Exception("Impossible d'enregistrer la troisième question. La question n'a pas été renseignée ou son format est incorrect. Veuillez la renseigner.");
        }
        if (!isset($arguments["response3"]) || !is_string($arguments["response3"])){
            throw new Exception("Impossible d'enregistrer la troisième réponse. La réponse n'a pas été renseignée ou son format est incorrect. Veuillez la renseigner.");
        }

        if (!$settingsManager->isAdminQuestionsDefined()) {
            // the first register for the admin
            $settingsManager->registerAdminQuestions($arguments["question1"], $arguments["response1"]);
            $settingsManager->registerAdminQuestions($arguments["question2"], $arguments["response2"]);
            $settingsManager->registerAdminQuestions($arguments["question3"], $arguments["response3"]);

            $reply->replyData([
                "redirect" => "setupTime.php"
            ]);
        } elseif ($session->isAdmin()) {
            // admin want to change his questions
            $settingsManager->updateAdminQuestions($arguments["question1"], $arguments["response1"], $arguments["question2"], $arguments["response2"], $arguments["question3"], $arguments["response3"]);

            $reply->replyData([
                "redirect" => "settings.php"
            ]);
        } else {
            throw new Exception("Veuillez vous identifier avant de modifier le mot de passe.");
        }
    } else {
        throw new Exception("La méthode de requête est incorrecte.");
    }
} catch (\Throwable $th) {
    $reply->replyError($errorTitle, $th);
}