<?php

/**
 * This class is a singleton that allows you to connect to the database.
 */
class Database {
/**
     * Database singleton class instance
     * @var Database
     * @access private
     */
    private static $instance = null;

    /**
     * Database connection object
     * @var PDO
     * @access private
     */
    private $db = null;
    
    /**
     * Default constructor
     */
    private function __construct() {
        $this->db = self::initDataBase();
        $this->db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
        $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }
    
    /**
     * Creates unique instance of the class
     * if it doesn't exists then return it
     *
     * @return Database
     */
    public static function getInstance() {
    
        if(is_null(self::$instance)) {
            self::$instance = new Database();
        }
    
        return self::$instance;
    }

    /**
     * Initiates a database connection.
     *
     * @throws Exception Can throw an exception if the connexion to the database has failed.
     * @return PDO Database connection object
     */
    private function initDataBase() : PDO
    {
        $dsn = "mysql:dbname=phase1;host=localhost;port=3306";
        $user = "quentin";
        $password = "fleur12345@qtn!";

        try {
            return new PDO($dsn, $user, $password);
        } catch (PDOException $e) {
            throw new Exception("Impossible de se connecter à la base de données. {$e->getMessage()}");
        }
    }


    /**
     * Prepares and executes a SQL query.
     *
     * @param string $query Query who need to be execute
     * @param array $parameters Parameter(s) of the query
     * @throws Exception Can throw an exception if the connexion to the database has failed.
     * @throws Exception Can throw an exception if the request preparation has failed.
     * @throws PDOException Can throw an exception if the request execution has failed.
     *
     * @return array
     */
    public function fetchAll(string $query, array $parameters = []) : array {
        if (!$this->db){
            throw new Exception("La connexion à la base de donnée a échoué.");
        }

        $statement = $this->db->prepare($query);

        if (!$statement) {
            throw new Exception("La préparation de la requête a échouée. Erreur SQLSTATE " . $this->db->errorInfo()[0] . " : " . $this->db->errorInfo()[2]);
        }

        $statement->execute($parameters);

        return $statement->fetchAll();
    }


    /**
     * Deletes all data in the measurement cell (reset of the measurement cell)
     *
     * @throws Exception Can throw an exception if the removal of all data from the Settings table has failed.
     * @throws Exception Can throw an exception if the removal of all data from the Measurements table has failed.
     * @throws Exception Can throw an exception if the removal of all data from the Logs table has failed.
     * @throws Exception Can throw an exception if the removal of all data from the Campaigns table has failed.
     * @throws Exception Can throw an exception if the removal of all data from the Configurations table has failed.
     */
    public function resetAll()
    {
        //Deleting Raspbery Pi settings
        try {
            self::fetchAll("DELETE FROM Settings");
        } catch (\Throwable $th) {
            throw new Exception("Impossible de supprimer les paramètres du Raspbery Pi. {$th->getMessage()}");
        }

        //Removal of measurements
        try {
            self::fetchAll("DELETE FROM Measurements");
        } catch (\Throwable $th) {
            throw new Exception("Impossible de supprimer les mesures des campagnes. {$th->getMessage()}");
        }

        //Removal of logs
        try {
            self::fetchAll("DELETE FROM Logs");
        } catch (\Throwable $th) {
            throw new Exception("Impossible de supprimer les logs. {$th->getMessage()}");
        }

        //Removal of campaigns
        try {
            self::fetchAll("DELETE FROM Campaigns");
        } catch (\Throwable $th) {
            throw new Exception("Impossible de supprimer les campagnes. {$th->getMessage()}");
        }

        //Removal of configurations
        try {
            self::fetchAll("DELETE FROM Configurations");
        } catch (\Throwable $th) {
            throw new Exception("Impossible de supprimer les configurations. {$th->getMessage()}");
        }

        //Removal of security questions
        try {
            self::fetchAll("DELETE FROM Questions");
        } catch (\Throwable $th) {
            throw new Exception("Impossible de supprimer les questions de sécurité. {$th->getMessage()}");
        }

        //Removal of users
        try {
            self::fetchAll("DELETE FROM Users");
        } catch (\Throwable $th) {
            throw new Exception("Impossible de supprimer les utilisateurs. {$th->getMessage()}");
        }
    }
}
