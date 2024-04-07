<?php

require_once 'Database.php';
require_once 'Session.php';

/**
 * This class is a singleton that allows you to manage the settings of the Raspberry Pi stored in the database.
 */
class SettingsManager {
    /**
     * SettingsManager singleton class instance
     * @var SettingsManager
     * @access private
     * @static
     */
    private static $instance = null;

    /**
     * Database singleton class instance
     * @var Database
     * @access private
     */
    private $db = null;

    /**
     * @var Session
     * @access private
     */
    private $session = null;
    
    /**
     * Default constructor
     */
    private function __construct() {
        $this->db = Database::getInstance();
        $this->session = Session::getInstance();
    }
    
    /**
     * Creates unique instance of the class
     * if it doesn't exists then return it
     *
     * @return SettingsManager
     */
    public static function getInstance() {
    
        if(is_null(self::$instance)) {
            self::$instance = new SettingsManager();
        }
    
        return self::$instance;
    }

    /**
     * Recovery of Raspbery Pi settings or redirection to the beginning page if the settings are not defined
     * @throws Exception Can throw exceptions during the execution of the SQL query.
     * @return array Array of settings
     */
    public function getSettings() : array
    {
        try {
            $data = $this->db->fetchAll("SELECT * , NOW() AS 'date' FROM Settings");
            if (!empty($data)) {
                return $data[0];
            } else {
                header("Location: /beginning.php");
                return [];
            }
        } catch (\Throwable $th) {
            throw new Exception("Impossible de récupérer les paramètres du Raspberry Pi. {$th->getMessage()}");
        }
    }

    /**
     * Defines new Raspbery Pi settings
     *
     * @param int $supprInterval The interval of time to delete campaigns
     * @param bool $enabled The state of the automatic deletion
     * @throws Exception Can throw exceptions during the execution of the SQL query.
     */
    public function setSettings(int $supprInterval, bool $enabled)
    {
        try {
            $this->db->fetchAll("DELETE FROM Settings");
            $this->db->fetchAll("INSERT INTO Settings VALUES (:varSuppr, :varEnabled)", [
                'varSuppr' => $supprInterval,
                'varEnabled' => (int)$enabled
            ]);
        } catch (\Throwable $th) {
            throw new Exception("Impossible de modifier les paramètres. {$th->getMessage()}");
        }
    }
    
    /**
     * Saves security questions and answers for the admin
     *
     * @param string $question
     * @param string $response
     * @throws Exception Can throw exceptions during the execution of the SQL query.
     */
    public function registerAdminQuestions(string $question,string $response)
    {
        $id = $this->session->getAdminUserId();
        try {
            $this->db->fetchAll("INSERT INTO Questions VALUES (:id, :question, :response)", [
                'id' => $id,
                'question' => $question,
                'response' => strtolower($response)

            ]);
        } catch (\Throwable $th) {
            throw new Exception("Impossible d'enregistrer les réponses et questions de sécurité. {$th->getMessage()}");
        }
    }

    /**
     * Modifies security questions and answers for the admin
     *
     * @param string $question1 The first question
     * @param string $response1 The first response
     * @param string $question2 The second question
     * @param string $response2 The second response
     * @param string $question3 The third question
     * @param string $response3 The third response
     * @throws Exception Can throw exceptions during the execution of the SQL query.
     */
    public function updateAdminQuestions(string $question1,string $response1,string $question2,string $response2,string $question3,string $response3)
    {
        $id = $this->session->getAdminUserId();
        try {
            $this->db->fetchAll("DELETE FROM Questions WHERE idUser = :id", [
                'id' => $id
            ]);
            $this->db->fetchAll("INSERT INTO Questions VALUES (:id, :question1, :response1)", [
                'id' => $id,
                'question1' => $question1,
                'response1' => strtolower($response1)
            ]);
            $this->db->fetchAll("INSERT INTO Questions VALUES (:id, :question2, :response2)", [
                'id' => $id,
                'question2' => $question2,
                'response2' => strtolower($response2)
            ]);
            $this->db->fetchAll("INSERT INTO Questions VALUES (:id, :question3, :response3)", [
                'id' => $id,
                'question3' => $question3,
                'response3' => strtolower($response3)
            ]);
        } catch (\Throwable $th) {
            throw new Exception("Impossible de modifier les réponses et questions de sécurité. {$th->getMessage()}");
        }
    }

    /**
     * Verifies security questions and answers
     *
     * @param string $question1 The first question
     * @param string $response1 The first response
     * @param string $question2 The second question
     * @param string $response2 The second response
     * @param string $question3 The third question
     * @param string $response3 The third response
     * @throws Exception Can throw exceptions during the execution of the SQL query.
     * @return true if all is correct, false otherwise
     */
    public function checkAdminQuestions(string $question1,string $response1,string $question2,string $response2,string $question3,string $response3): bool
    {
        try {
            $results = $this->db->fetchAll("SELECT answer FROM Questions WHERE (question = :question1 AND answer = :answer1) OR (question = :question2 AND answer = :answer2) OR (question = :question3 AND answer = :answer3)", [
                'question1' => $question1,
                'answer1' => strtolower($response1),
                'question2' => $question2,
                'answer2' => strtolower($response2),
                'question3' => $question3,
                'answer3' => strtolower($response3)
            ]);

            if (count($results) != 3) {
                return false;
            }
        } catch (\Throwable $th) {
            throw new Exception("Impossible de récupérer la première question de sécurité et sa réponse {$th->getMessage()}");
        }

        return true;
    }

    /**
     * Modifies the password of the admin into the database (the password will be stored hashed)
     *
     * @throws Exception Can throw exceptions during the execution of the SQL query.
     * @return bool returns true if the admin is registered in the database.
     */
    public function areAdminQuestionsDefined() : bool
    {
        $id = $this->session->getAdminUserId();
        try {
            $results = $this->db->fetchAll("SELECT idUser FROM Questions WHERE idUser = :id", [
                'id' => $id
            ]);
        
            return !empty($results);
        } catch (\Throwable $th) {
            throw new Exception("Impossible de déterminer si les questions de sécurités ont été définies. {$th->getMessage()}");
        }
    }

    /**
     * Returns the security questions
     * @throws Exception Can throw exceptions during the execution of the SQL query.
     * @return array
     */
    public function getSecurityQuestions()    {
        try {
            return $this->db->fetchAll("SELECT question FROM Questions");
        } catch (\Throwable $th) {
            throw new Exception("Impossible de récupérer les questions de sécurité. {$th->getMessage()}");
        }
    }
}
