<?php

include_once '../include/Session.php';
include_once '../include/RequestReplySender.php';
include_once '../include/SettingsManager.php';

$reply = RequestReplySender::getInstance();
$settingsManager = SettingsManager::getInstance();
$errorTitle = "Impossible de se connecter avec les questions de sécurité.";

try {    
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // handle POST request

        $data = file_get_contents("php://input");
        $arguments = json_decode($data, true);

        if (!isset($arguments["question1"]) || !is_string($arguments["question1"])){
            throw new Exception("Impossible de répondre à la première question. La question n'a pas été transimise ou son format est incorrect. Veuillez le réessayer.");
        }
        if (!isset($arguments["response1"]) || !is_string($arguments["response1"])){
            throw new Exception("Impossible d'enregistrer la première réponse. La réponse n'a pas été transimise ou son format est incorrect. Veuillez le réessayer.");
        }
        if (!isset($arguments["question2"]) || !is_string($arguments["question2"])){
            throw new Exception("Impossible d'enregistrer la deuxième question. La question n'a pas été transimise ou son format est incorrect. Veuillez le réessayer.");
        }
        if (!isset($arguments["response2"]) || !is_string($arguments["response2"])){
            throw new Exception("Impossible d'enregistrer la deuxième réponse. La réponse n'a pas été renseignée ou son format est incorrect. Veuillez le réessayer.");
        }
        if (!isset($arguments["question3"]) || !is_string($arguments["question3"])){
            throw new Exception("Impossible d'enregistrer la troisième question. La question n'a pas été renseignée ou son format est incorrect. Veuillez le réessayer.");
        }
        if (!isset($arguments["response3"]) || !is_string($arguments["response3"])){
            throw new Exception("Impossible d'enregistrer la troisième réponse. La réponse n'a pas été renseignée ou son format est incorrect. Veuillez le réessayer.");
        }

        if (!$settingsManager->checkAdminQuestions($arguments["question1"], $arguments["response1"], $arguments["question2"], $arguments["response2"], $arguments["question3"], $arguments["response3"])) {
            throw new Exception("Les réponses sont incorrectes.");
        }

        $reply->replySuccess();
    } else {
        throw new Exception("La méthode de requête est incorrecte.");
    }
} catch (\Throwable $th) {
    $reply->replyError($errorTitle, $th);
}