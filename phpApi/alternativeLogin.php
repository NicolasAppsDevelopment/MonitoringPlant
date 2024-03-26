<?php

include_once '../include/Session.php';
include_once '../include/RequestReplySender.php';

$errorTitle = "Impossible de se connecter";

try {    
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // handle POST request

        $data = file_get_contents("php://input");
        $arguments = json_decode($data, true);

        if (!isset($arguments["question1"]) || !is_string($arguments["question1"])){
            replyError("Impossible de répondre à la première question", "La question n'a pas été transimise ou son format est incorrect. Veuillez le réessayer.");
        }
        if (!isset($arguments["response1"]) || !is_string($arguments["response1"])){
            replyError("Impossible d'enregistrer la première réponse", "La réponse n'a pas été transimise ou son format est incorrect. Veuillez le réessayer.");
        }
        if (!isset($arguments["question2"]) || !is_string($arguments["question2"])){
            replyError("Impossible d'enregistrer la deuxième question", "La question n'a pas été transimise ou son format est incorrect. Veuillez le réessayer.");
        }
        if (!isset($arguments["response2"]) || !is_string($arguments["response2"])){
            replyError("Impossible d'enregistrer la deuxième réponse", "La réponse n'a pas été renseignée ou son format est incorrect. Veuillez le réessayer.");
        }
        if (!isset($arguments["question3"]) || !is_string($arguments["question3"])){
            replyError("Impossible d'enregistrer la troisième question", "La question n'a pas été renseignée ou son format est incorrect. Veuillez le réessayer.");
        }
        if (!isset($arguments["response3"]) || !is_string($arguments["response3"])){
            replyError("Impossible d'enregistrer la troisième réponse", "La réponse n'a pas été renseignée ou son format est incorrect. Veuillez le réessayer.");
        }

        try {
            $response1=$this->db->fetchAll("SELECT answer FROM Questions WHERE question=:question1", [
                'question1' => $arguments["question1"]
            ]);
            if ($arguments["response1"] != $response1[0]){
                return false;
            } 
        } catch (\Throwable $th) {
            throw new Exception("Impossible de récupérer la première question de sécurité et sa réponse {$th->getMessage()}");
        }

        try {
            $response2=$this->db->fetchAll("SELECT answer FROM Questions WHERE question=:question2", [
                'question2' => $arguments["question2"]
            ]);
            if ($arguments["response2"] != $response2[0]){
                return false;
            } 
        } catch (\Throwable $th) {
            throw new Exception("Impossible de récupérer la seconde question de sécurité et sa réponse {$th->getMessage()}");
        }

        try {
            $response3=$this->db->fetchAll("SELECT answer FROM Questions WHERE question=:question3", [
                'question3' => $arguments["question3"]
            ]);
            if ($arguments["response3"] != $response3[0]){
                return false;
            } 
        } catch (\Throwable $th) {
            throw new Exception("Impossible de récupérer la troisième question de sécurité et sa réponse {$th->getMessage()}");
        }

        return true;
        
    } else {
        throw new Exception("La méthode de requête est incorrecte.");
    }
} catch (\Throwable $th) {
    $reply->replyError($errorTitle, $th);
}