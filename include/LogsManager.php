<?php

require_once 'Database.php';

/**
 * This class is a singleton that allows you to manage campaign logs stored in the database.
 */
class LogsManager {
    /**
     * LogsManager singleton class instance
     * @var LogsManager
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
     * Default constructor
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
     * Recovery of logs of the campaign whose id is entered in parameter.
     *
     * @param int $id Id of the campaign
     * @param string|null $sinceDatetime Date from which the logs are to be retrieved
     * @throws Exception Can throw exceptions during the execution of the SQL query.
     * @return array
     */
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
     * Deletes logs from the campaign whose id is entered in parameter
     * Returns true if the logs are deleted.
     *
     * @param int $id Id of the campaign
     * @throws Exception Can throw exceptions during the execution of the SQL query.
     */
    public function supprLogs(int $id)
    {
        //Removal of logs
        try {
            $this->db->fetchAll("DELETE FROM Logs WHERE idCampaign = :varId", [
                'varId' => $id
            ]);
        } catch (\Throwable $th) {
            throw new Exception("Impossible de supprimer les logs de la campagne. {$th->getMessage()}");
        }
    }
}
