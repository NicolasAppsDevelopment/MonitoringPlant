<?php
require_once 'Database.php';
require_once 'MeasurementsManager.php';
require_once 'LogsManager.php';
require_once 'ConfigurationsManager.php';

/**
 * This class is a singleton that allows you to manage the campaigns stored in the database.
 */
class CampaignsManager {
    /**
     * CampaignsManager singleton class instance
     *
     * @var CampaignsManager
     * @access private
     * @static
     */
    private static $instance = null;

    /**
     * Database singleton class instance
     *
     * @var Database
     * @access private
     */
    private $db = null;

    /**
     * MeasurementsManager singleton class instance
     *
     * @var MeasurementsManager
     * @access private
     */
    private $measuresManager = null;

    /**
     * LogsManager singleton class instance
     *
     * @var LogsManager
     * @access private
     */
    private $logsManager = null;

    /**
     * ConfigurationsManager singleton class instance
     *
     * @var ConfigurationsManager
     * @access private
     */
    private $configsManager = null;
    
    /**
     * Constructor of the class
     */
    private function __construct() {
        $this->db = Database::getInstance();
        $this->measuresManager = MeasurementsManager::getInstance();
        $this->logsManager = LogsManager::getInstance();
        $this->configsManager = ConfigurationsManager::getInstance();
    }
    
    /**
     * Create unique instance of the class if it already exists then return it
     *
     * @return CampaignsManager
     */
    public static function getInstance() {
    
        if(is_null(self::$instance)) {
            self::$instance = new CampaignsManager();
        }
    
        return self::$instance;
    }

    /**
     * Returns a list of all campaigns informations stored in the database according to the filter.
     *
     * @param array $filter Array of filters to apply to the list (name, processing, success, warn, error, startDate, startTime, endDate, endTime).
     * name: Name of the campaign.
     * processing: True if the campaign is running.
     * success: True if the campaign is finished and successful.
     * warn: True if the campaign has a warning (still running or not).
     * error: True if the campaign is finished with an unexpected error.
     * startDate: Start date of the campaign.
     * startTime: Start time of the campaign.
     * endDate: End date of the campaign.
     * endTime: End time of the campaign.
     *
     * @throws Exception Can throw exceptions during the execution of the SQL query.
     * @return array
     */
    public function getListCampaign(array $filter = null) : array
    {
        $query = "SELECT * FROM Campaigns ";
        $whereClauses = [];
        $parameters = [];

        if (isset($filter) && !empty($filter)) {
            $query .= "WHERE ";

            if (!empty($filter["name"])) {
                array_push($whereClauses, "LOWER(name) LIKE :varName");
                $parameters["varName"] = "%" . htmlspecialchars($filter["name"]) . "%";
            }
    
            if (!empty($filter["processing"]) && $filter["processing"]) {
                array_push($whereClauses, "finished = 0");
            }
            if (!empty($filter["success"]) && $filter["success"]) {
                array_push($whereClauses, "finished = 1 and alertLevel = 0");
            }
            if (!empty($filter["warn"]) && $filter["warn"]) {
                array_push($whereClauses, "alertLevel = 1");
            }
            if (!empty($filter["error"]) && $filter["error"]) {
                array_push($whereClauses, "finished = 1 and alertLevel = 2");
            }
            
            if (!empty($filter["startDate"]) && $filter["processing"]) {
                array_push($whereClauses, "DATE_FORMAT(beginDate, '%Y-%m-%d') >= :varStartDate");
                $parameters["varStartDate"] = $filter["startDate"];
            }
        
            if (!empty($filter["startTime"])) {
                array_push($whereClauses, "DATE_FORMAT(beginDate, '%k:%i') >= :varStartTime");
                $parameters["varStartTime"] = $filter["startTime"];
            }

            if (!empty($filter["endDate"])) {
                array_push($whereClauses, "DATE_FORMAT(endingDate, '%Y-%m-%d') <= :varEndDate");
                $parameters["varEndDate"] = $filter["endDate"];
            }
        
            if (!empty($filter["endTime"])) {
                array_push($whereClauses, "DATE_FORMAT(endingDate, '%k:%i') <= :varEndTime");
                $parameters["varEndTime"] = $filter["endTime"];
            }
        }

        $query .= join(" AND ", $whereClauses) . " ORDER BY beginDate DESC";

        try {
            return $this->db->fetchAll($query, $parameters);
        } catch (\Throwable $th) {
            throw new Exception("Impossible de récupérer la liste des campagnes. {$th->getMessage()}");
        }
    }

    /**
     * Returns the id of the campaign whose name  is entered in parameter
     *
     * @param string $name Name of a campaign
     * @throws Exception Can throw exceptions during the execution of the SQL query.
     * @throws Exception Can throw an exception if the name of the campaign is not found.
     * @return int
     */
    public function getIdCampaign(string $name): int {
        try {
            $results = $this->db->fetchAll("SELECT idCampaign FROM Campaigns WHERE name = :varName ORDER BY 1 DESC", [
                'varName' => htmlspecialchars($name)
            ]);
        
            if (!empty($results)) {
                return $results[0]["idCampaign"];
            } else {
                throw new Exception("Le nom de la campagne de mesure est introuvable.");
            }
        } catch (\Throwable $th) {
            throw new Exception("Impossible de récupérer l'identifiant de la campagne par son nom. {$th->getMessage()}");
        }
    }

    /**
     * Returns true if the name entered in parameter corresponds to an existing campaign.
     *
     * @param string $name Name of a campaign
     * @throws Exception Can throw exceptions during the execution of the SQL query.
     * @return bool
     */
    public function existCampaign(string $name): bool {
        try {
            $results = $this->db->fetchAll("SELECT idCampaign FROM Campaigns WHERE name = :varName ORDER BY 1 DESC", [
                'varName' => htmlspecialchars($name)
            ]);
        
            return !empty($results);
        } catch (\Throwable $th) {
            throw new Exception("Impossible de vérifier l'existance d'une campagne par son nom. {$th->getMessage()}");
        }
    }

    /**
     * Creates a campaign according to the parameters entered and returns the id of the new campaign.
     *
     * @param int $configId  Id of the configuration of the new campaign
     * @param string $name  Name of the new campaign
     * @param bool $temperatureSensor  True if the new campaign take the temperature
     * @param bool $CO2Sensor  True if the new campaign take the CO2
     * @param bool $O2Sensor  True if the new campaign take the O2
     * @param bool $luminositySensor  True if the new campaign take the luminosity
     * @param bool $humiditySensor  True if the new campaign take the humidity
     * @param int $interval  Interval between each measurements of the new campaign
     * @param ?float $volume  Volume in wich the new campaign take measurements
     * @param int $duration  Duration of the new campaign
     * @param bool $humidMode  True if the new campaign happened in a humid environment
     * @param bool $enableFiboxTemp  True if the new campaign take the temperature of the fibox
     * @throws Exception Can throw exceptions during the execution of the SQL query.
     * @throws Exception Can throw an exception if a campaign with the same name already exists.
     * @return int id of the new campaign
     */
    public function addCampaign(int $configId, string $name, bool $temperatureSensor, bool $CO2Sensor, bool $O2Sensor, bool $luminositySensor, bool $humiditySensor, int $interval, ?float $volume, int $duration, bool $humidMode, bool $enableFiboxTemp) : int
    {
        try {
            if (self::existCampaign($name)) {
                throw new Exception("Une campagne de mesure avec le même nom existe déjà. Veuillez en choisir un autre.");
            }

            $this->db->fetchAll("INSERT INTO Campaigns VALUES (NULL, :varConfigId, :varName, NOW(), :varTemperatureSensor, :varCO2Sensor, :varO2Sensor, :varLuminositySensor, :varHumiditySensor, :varInterval, :varVolume, :varDuration, :varHumidMode, :varEnableFiboxTemp, 0, 0, DATE_ADD(NOW(), INTERVAL :varDuration2 SECOND))", [
                'varConfigId' => $configId,
                'varName' => htmlspecialchars($name),
                'varTemperatureSensor' => (int)$temperatureSensor,
                'varCO2Sensor' => (int)$CO2Sensor,
                'varO2Sensor' => (int)$O2Sensor,
                'varLuminositySensor' => (int)$luminositySensor,
                'varHumiditySensor' => (int)$humiditySensor,
                'varInterval' => $interval,
                'varVolume' => $volume,
                'varDuration' => $duration,
                'varDuration2' => $duration, // PDO ne permet pas d'utiliser le même paramètre de liaison plus d'une fois dans une requête !
                'varHumidMode' => (int)$humidMode,
                'varEnableFiboxTemp' => (int)$enableFiboxTemp
            ]);

            return self::getIdCampaign($name);
        } catch (\Throwable $th) {
            throw new Exception("Impossible d'ajouter la campagne. {$th->getMessage()}");
        }
    }

    /**
     * Deletes all data of the campaign whose id is entered as a parameter
     *
     * @param int Id of the campaign to delete
     * @throws Exception Can throw exceptions during the execution of the SQL query.
     */
    public function supprCampaign(int $id)
    {
        //Removal of measurements
        $this->measuresManager->supprMeasurements($id);

        //Removal of logs
        $this->logsManager->supprLogs($id);

        //Removal of the campaign
        try {
            $this->db->fetchAll("DELETE FROM Campaigns WHERE idCampaign = :varId", [
                'varId' => $id
            ]);
        } catch (\Throwable $th) {
            throw new Exception("Impossible de supprimer la campagne. {$th->getMessage()}");
        }
    }

    /**
     * Restarts a campaign whose id is entered as a parameter
     *
     * @param int Id of the campaign to restart
     * @throws Exception Can throw exceptions during the execution of the SQL query.
     */
    public function restartCampaign(int $id)
    {
        //Removal of measurements
        $this->measuresManager->supprMeasurements($id);

        //Removal of logs
        $this->logsManager->supprLogs($id);
        
        //Update campaign start and end dates
        try {
            $this->db->fetchAll("UPDATE Campaigns SET beginDate=NOW(), endingDate=DATE_ADD(NOW(),INTERVAL duration SECOND) WHERE idCampaign = :varId", [
                'varId' => $id
            ]);
        } catch (\Throwable $th) {
            throw new Exception("Impossible de redémarrer la campagne. {$th->getMessage()}");
        }

    }

    /**
     * Exports measurements from a campaign according to the parameters entered.
     *
     * @param string $id  Id of the new campaign
     * @param bool $temperatureSensor  True if the export take the temperature recorded by the campaign
     * @param bool $CO2Sensor  True if the export take the CO2 recorded by the campaign
     * @param bool $O2Sensor  True if the export take the O2 recorded by the campaign
     * @param bool $luminositySensor  True if the export take the luminosity recorded by the campaign
     * @param bool $humiditySensor  True if the export take the humidity recorded by the campaign
     * @param string $beginDate     Date of begin of measurements recovery
     * @param string $endDate   Date of end of measurements recovery
     * @throws Exception Can throw exceptions during the execution of the SQL query.
     * @return array Array containing the measurements following the parameters entered
     */
    public function exportCampaign(int $id, bool $temperatureSensor, bool $CO2Sensor, bool $O2Sensor, bool $luminositySensor, bool $humiditySensor, string $beginDate, string $endDate) : array
    {
        $parameters = [];
        $query = "SELECT ";
        
        if ($temperatureSensor){
            $query.="temperature,";
        }
        if ($CO2Sensor){
            $query.="CO2,";
        }
        if ($O2Sensor){
            $query.="O2,";
        }
        if ($luminositySensor){
            $query.="luminosity,";
        }
        if ($humiditySensor){
            $query.="humidity,";
        }
        
        $query.="date FROM Measurements WHERE idCampaign = :varId";
        $parameters["varId"] = $id;
        
        if ($beginDate != "") {
            $query.= " AND date >= :varBeginDate";
            $parameters["varBeginDate"] = $beginDate;
        }
        if ($endDate != "") {
            $query.= " AND date <= :varEndDate";
            $parameters["varEndDate"] = $endDate;
        }

        try {
            return $this->db->fetchAll($query, $parameters);
        } catch (\Throwable $th) {
            throw new Exception("Impossible de récupérer les données de la campagne pour l'export. {$th->getMessage()}");
        }
    }

    /**
     * Recovers all the data of the campaign whose id is entered as a parameter.
     * It retrieves the general information of the campaign, the measurements and the logs.
     *
     * @param int $id
     * @param ?string $logSinceDatetime If not null, only logs after this date will be returned
     * @param ?string $measureSinceDatetime If not null, only measurements after this date will be returned
     * @throws Exception Can throw exceptions during the execution of the SQL query.
     * @return array
     */
    public function getCampaign(int $id, ?string $logSinceDatetime = null, ?string $measureSinceDatetime = null) : array {
        try {
            $campaignInfo = self::getInfoCampaign($id);
            try {
                $campaignInfo["nameConfig"] = $this->configsManager->getNameConfiguration($campaignInfo["idConfig"]);
            } catch (\Throwable $th) {
                $campaignInfo["nameConfig"] = "Configuration supprimée";
            }

            return array(
                "campaignInfo" => $campaignInfo,
                "measurements" => $this->measuresManager->getMeasurements($id, $measureSinceDatetime),
                "logs" => $this->logsManager->getLogs($id, $logSinceDatetime)
            );
        } catch (\Throwable $th) {
            throw new Exception("Impossible de récupérer les données de la campagne. {$th->getMessage()}");
        }
    }

    /**
     * Recovery of general information about the campaign whose id is entered as a parameter.
     *
     * @param int $id Id of the campaign
     * @throws Exception Can throw exceptions during the execution of the SQL query.
     * @throws Exception Can throw an exception if the campaign is not found.
     * @return array
     */
    public function getInfoCampaign(int $id) : array {
        try {
            $results = $this->db->fetchAll("SELECT * FROM Campaigns WHERE idCampaign = :varId", [
                'varId' => $id
            ]);

            if (!empty($results)) {
                return $results[0];
            } else {
                throw new Exception("La campagne de mesure associé à l'identifiant donné est introuvable.");
            }
        } catch (\Throwable $th) {
            throw new Exception("Impossible de récupérer les informations de la campagne. {$th->getMessage()}");
        }
    }
}
