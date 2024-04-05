<?php

require_once 'Database.php';

class LogsManager {
    /**
     * @var LogsManager
     * @access private
     * @static
     */
    private static $instance = null;

    /**
     * @var Database
     * @access private
     */
    private $db = null;
    
    /**
     * Default constructor
     *
     * @return void
     */
    private function __construct() {
        $this->db = Database::getInstance();
    }
    
    /**
     * Create unique instance of the class
     * if it doesn't exists then return it
     *
     * @return LogsManager
     */
    public static function getInstance() {
    
        if(is_null(self::$instance)) {
            self::$instance = new LogsManager();
        }
    
        return self::$instance;
    }

    /**
     * Description.
     *
     * @param {string} message
     * @return {string}
     */
    //Recovery of logs of the campaign whose id is entered as a parameter
    public function getLogs(int $id, ?string $sinceDatetime = null) : array {
        try {
            $query = "SELECT * FROM Logs WHERE idCampaign = :varId";
            $parameters = [
                'varId' => $id
            ];

            if ($sinceDatetime != null){
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
