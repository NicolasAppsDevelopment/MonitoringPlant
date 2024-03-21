<?php

require_once 'Database.php';

class MeasurementsManager {
    /**
     * @var MeasurementsManager
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
     * @return MeasurementsManager
     */
    public static function getInstance() {
    
        if(is_null(self::$_instance)) {
            self::$_instance = new MeasurementsManager();
        }
    
        return self::$_instance;
    }

    /**
     * Description.
     *
     * @param {string} message
     * @return {string}
     */
    //Recovery of measurements of the campaign whose id is entered as a parameter
    public function getMeasurements(int $id, ?string $sinceDatetime = NULL) : array {
        try {
            $query = "SELECT * FROM Measurements WHERE idCampaign = :id";
            $parameters = [
                'id' => $id
            ];

            if ($sinceDatetime != NULL){
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
     *
     * @param int $id Id of the campaign
     * @return bool
     */
    public function supprMeasurements(int $id) : bool
    {
        //Removal of measurements
        try {
            $this->db->fetchAll("DELETE FROM Measurements WHERE idCampaign = :varId", [
                'varId' => $id
            ]);
            return true;
        } catch (\Throwable $th) {
            throw new Exception("Impossible de supprimer les mesures de la campagne. {$th->getMessage()}");
        }
    }
}
