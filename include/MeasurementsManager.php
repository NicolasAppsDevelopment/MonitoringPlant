<?php

require_once 'Database.php';

/**
 * This class is a singleton that allows you to manage campaign measurements stored in the database.
 */
class MeasurementsManager {
    /**
     * MeasurementsManager singleton class instance
     * @var MeasurementsManager
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
     * @return MeasurementsManager
     */
    public static function getInstance() {
    
        if(is_null(self::$instance)) {
            self::$instance = new MeasurementsManager();
        }
    
        return self::$instance;
    }

    /**
     * Recovery of measurements of the campaign whose id is entered in parameter.
     *
     * @param int $id Id of the campaign
     * @param string|null $sinceDatetime Date from which the measurements are to be retrieved
     * @throws Exception Can throw exceptions during the execution of the SQL query.
     * @return array
     */
    public function getMeasurements(int $id, ?string $sinceDatetime = null) : array {
        try {
            $query = "SELECT * FROM Measurements WHERE idCampaign = :id";
            $parameters = [
                'id' => $id
            ];

            if ($sinceDatetime != null){
                $query .= " AND date > :fromDate";
                $parameters["fromDate"] = $sinceDatetime;
            }

            $query .= " ORDER BY date ASC";

            return $this->db->fetchAll($query, $parameters);
        } catch (\Throwable $th) {
            throw new Exception("Impossible de récupérer les données de mesure de la campagnes. {$th->getMessage()}");
        }
    }

    /**
     * Deletes measurements from the campaign whose id is entered as a parameter
     * Returns true if the measurements are deleted.
     * @throws Exception Can throw exceptions during the execution of the SQL query.
     * @param int $id Id of the campaign
     */
    public function supprMeasurements(int $id)
    {
        //Removal of measurements
        try {
            $this->db->fetchAll("DELETE FROM Measurements WHERE idCampaign = :varId", [
                'varId' => $id
            ]);
        } catch (\Throwable $th) {
            throw new Exception("Impossible de supprimer les mesures de la campagne. {$th->getMessage()}");
        }
    }
}
