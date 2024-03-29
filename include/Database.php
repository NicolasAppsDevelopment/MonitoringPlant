<?php

class Database {
    /**
     * @var Database
     * @access private
     * @static
     */
    private static $_instance = null;

    /**
     * @var PDO
     * @access private
     */
    private $db = null;
    
    /**
     * Default constructor
     *
     * @param void
     * @return void
     */
    private function __construct() {
        $this->db = self::initDataBase();
        $this->db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
        $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }
    
    /**
     * Create unique instance of the class
     * if it doesn't exists then return it
     *
     * @param void
     * @return Database
     */
    public static function getInstance() {
    
        if(is_null(self::$_instance)) {
            self::$_instance = new Database();
        }
    
        return self::$_instance;
    }

    /**
     * Connection to database.
     *
     * @return PDO
     */
    private function initDataBase() : PDO
    {
        $dsn = "mysql:dbname=p2201232;host=iutbg-lamp.univ-lyon1.fr;port=3306";
        $user = "p2201232";
        $password = "12201232";

        try {
            return new PDO($dsn, $user, $password);
        } catch (PDOException $e) {
            throw new Exception("Impossible de se connecter à la base de données. {$e->getMessage()}");
        }
    }


    /**
     * Preparing and executing a SQL query.
     *
     * @param string $query Query who need to be execute
     * @param string $parameters Parameter(s) of the query
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
     * Returns true if all raspberry pi data are deleted.
     *
     * @return bool
     */
    function resetAll() : bool
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

        return true;
    }
}
