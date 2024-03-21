<?php

require_once 'Database.php';

class LogsManager {
    /**
     * @var LogsManager
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
     * Default constructor
     *
     * @param void
     * @return void
     */
    private function __construct() {
        $this->db = Database::getInstance();
    }
    
    /**
     * Create unique instance of the class
     * if it doesn't exists then return it
     *
     * @param void
     * @return LogsManager
     */
    public static function getInstance() {
    
        if(is_null(self::$_instance)) {
            self::$_instance = new LogsManager();
        }
    
        return self::$_instance;
    }

    /**
     * Description.
     * 
     * @param {string} message
     * @return {string}
     */
    //Recovery of logs of the campaign whose id is entered as a parameter
    public function getLogs(int $id, ?string $sinceDatetime = NULL) : array {
        try {
            $query = "SELECT * FROM Logs WHERE idCampaign = :varId";
            $parameters = [
                'varId' => $id
            ];

            if ($sinceDatetime != NULL){
                $query .= " AND occuredDate > :fromDate";
                $parameters["fromDate"] = $sinceDatetime;
            }

            return $this->db->fetchAll($query, $parameters);
        } catch (\Throwable $th) {
            throw new Exception("Impossible de récupérer l'historique des évenements de la campagne. {$th->getMessage()}");
        }
    }

    /**
     * Deletes logs from the campaign whose id is entered as a parameter
     * Returns true if the logs are deleted.
     * 
     * @param int $id Id of the campaign
     * @return bool
     */
    public function supprLogs(int $id) : bool
    {
        //Removal of logs
        try {
            $this->db->fetchAll("DELETE FROM Logs WHERE idCampaign = :varId", [
                'varId' => $id
            ]);
            return true;
        } catch (\Throwable $th) {
            throw new Exception("Impossible de supprimer les logs de la campagne. {$th->getMessage()}");
        }
    } 
}
