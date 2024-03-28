<?php

require_once 'Database.php';
require_once 'Session.php';

class SettingsManager {
    /**
     * @var SettingsManager
     * @access private
     * @static
     */
    private static $_instance = null;

    /**
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
     *
     * @param void
     * @return void
     */
    private function __construct() {
        $this->db = Database::getInstance();
        $this->session = Session::getInstance();
    }
    
    /**
     * Create unique instance of the class
     * if it doesn't exists then return it
     *
     * @param void
     * @return SettingsManager
     */
    public static function getInstance() {
    
        if(is_null(self::$_instance)) {
            self::$_instance = new SettingsManager();
        }
    
        return self::$_instance;
    }

    /**
     * Recovery of Raspbery Pi settings
     *
     * @return {array} Array of settings
     */
    public function getSettings() : array
    {
        try {
            $data = $this->db->fetchAll("SELECT * , NOW() AS 'date' FROM Settings");
            if (count($data) > 0) {
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
     * Save recovery questions and answers for the admin
     * 
     * @param string $question The question
     * @param string $response The response
     */
    public function registerAdminQuestions(string $question,string $response)
    {
        $id = $this->session->getAdminUserId();
        try {
            $this->db->fetchAll("INSERT INTO Questions VALUES (:id, :question, :response)", [
                'id' => $id,
                'question' => $question,
                'response' => $response

            ]);
        } catch (\Throwable $th) {
            throw new Exception("Impossible d'enregistrer les réponses et questions de sécurité. {$th->getMessage()}");
        }
    }

    /**
     * Modify recovery questions and answers for the admin
     *
     * @param string $question1 The first question
     * @param string $response1 The first response
     * @param string $question2 The second question
     * @param string $response2 The second response
     * @param string $question3 The third question
     * @param string $response3 The third response
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
                'response1' => $response1

            ]);
            $this->db->fetchAll("INSERT INTO Questions VALUES (:id, :question2, :response2)", [
                'id' => $id,
                'question2' => $question2,
                'response2' => $response2

            ]);
            $this->db->fetchAll("INSERT INTO Questions VALUES (:id, :question3, :response3)", [
                'id' => $id,
                'question3' => $question3,
                'response3' => $response3

            ]);
        } catch (\Throwable $th) {
            throw new Exception("Impossible de modifier les réponses et questions de sécurité. {$th->getMessage()}");
        }
    }

    /**
     * Modify the password of the admin into the database (the password will be stored hashed)
     *
     * @param string $password The password (not hashed)
     */
    public function isAdminQuestionsDefined()
    {
        $id = $this->session->getAdminUserId();
        try {
            $results = $this->db->fetchAll("SELECT idUser FROM Questions WHERE idUser = :id", [
                'id' => $id
            ]);
        
            if (count($results) > 0) {
                return true;
            } else {
                return false;
            }
        } catch (\Throwable $th) {
            throw new Exception("Impossible de déterminer si les questions de sécurités ont été définies. {$th->getMessage()}");
        }
    }

    /**
     * Returns the security questions
     */
    public function getSecurityQuestions()
    {
        try {
            //return $this->db->fetchAll("SELECT question FROM Questions"); 
            $array = array("test1", "test2", "test3");     
            return $array;    
        } catch (\Throwable $th) {
            throw new Exception("Impossible de récupérer les questions de sécurité. {$th->getMessage()}");
        }
    }
}
