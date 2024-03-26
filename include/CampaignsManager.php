<?php

require_once 'Database.php';
require_once 'MeasurementsManager.php';
require_once 'LogsManager.php';
require_once 'ConfigurationsManager.php';

class CampaignsManager {
    /**
     * @var CampaignsManager
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
     * @var MeasurementsManager
     * @access private
     */
    private $measuresManager = null;

    /**
     * @var LogsManager
     * @access private
     */
    private $logsManager = null;

    /**
     * @var ConfigurationsManager
     * @access private
     */
    private $configsManager = null;
    
    /**
     * Default constructor
     *
     * @param void
     * @return void
     */
    private function __construct() {
        $this->db = Database::getInstance();
        $this->measuresManager = MeasurementsManager::getInstance();
        $this->logsManager = LogsManager::getInstance();
        $this->configsManager = ConfigurationsManager::getInstance();
    }
    
    /**
     * Create unique instance of the class
     * if it doesn't exists then return it
     *
     * @param void
     * @return CampaignsManager
     */
    public static function getInstance() {
    
        if(is_null(self::$_instance)) {
            self::$_instance = new CampaignsManager();
        }
    
        return self::$_instance;
    }

    /**
     * Recovery of all measurement campaigns.
     *
     * @param array $filter Influences which campaigns the public function recovers
     * @return array
     */
    public function getListCampaign(array $filter = null) : array
    {
        $query = "SELECT * FROM Campaigns ";
        $whereClauses = [];
        $parameters = [];

        if (isset($filter) && !empty($filter)) {
            if (!empty($filter["name"]) || !empty($filter["time"]) || !empty($filter["date"]) || $filter["processing"] == true) {

                $query .= "WHERE ";

                if (!empty($filter["name"])) {
                    array_push($whereClauses, "LOWER(name) LIKE :varName");
                    $parameters["varName"] = "%" . htmlspecialchars($filter["name"]) . "%";
                }
        
                if ($filter["processing"] == true) {
                    array_push($whereClauses, "finished = 0");
                }
            
                if (!empty($filter["date"])) {
                    array_push($whereClauses, "DATE_FORMAT(beginDate, '%Y-%m-%d') = :varDate");
                    $parameters["varDate"] = $filter["date"];
                }
            
                if (!empty($filter["time"])) {
                    array_push($whereClauses, "DATE_FORMAT(beginDate, '%k:%i') = :varTime");
                    $parameters["varTime"] = $filter["time"];
                }
            }
        }

        $query .= join(" AND ", $whereClauses) . " ORDER BY finished ASC, beginDate DESC";

        try {
            return $this->db->fetchAll($query, $parameters);
        } catch (\Throwable $th) {
            throw new Exception("Impossible de récupérer la liste des campagnes. {$th->getMessage()}");
        }
    }

    /**
     * Returns the id of the campaign whose name entered in parameter matches
     *
     * @param string $name Name of a campaign
     * @return int
     */
    public function getIdCampaign(string $name): int {
        try {
            $results = $this->db->fetchAll("SELECT idCampaign FROM Campaigns WHERE name = :varName ORDER BY 1 DESC", [
                'varName' => htmlspecialchars($name)
            ]);
        
            if (count($results) > 0) {
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
     * @return bool
     */
    public function existCampaign(string $name): bool {
        try {
            $results = $this->db->fetchAll("SELECT idCampaign FROM Campaigns WHERE name = :varName ORDER BY 1 DESC", [
                'varName' => htmlspecialchars($name)
            ]);
        
            if (count($results) > 0) {
                return true;
            } else {
                return false;
            }
        } catch (\Throwable $th) {
            throw new Exception("Impossible de vérifier l'existance d'une campagne par son nom. {$th->getMessage()}");
        }
    }

    /**
     * Creates a campaign according to the parameters entered andd returns the id of the new campaign.
     *
     * @param int $config_id  Id of the configuration of the new campaign
     * @param string $name  Name of the new campaign
     * @param bool $temperatureSensor  True if the new campaign take the temperature
     * @param bool $CO2Sensor  True if the new campaign take the CO2
     * @param bool $O2Sensor  True if the new campaign take the O2
     * @param bool $luminositySensor  True if the new campaign take the luminosity
     * @param bool $humiditySensor  True if the new campaign take the humidity
     * @param int $interval  Interval between each measurements of the new campaign
     * @param ?float $volume  Volume in wich the new campaign take measurements
     * @param int $duration  Duration of the new campaign
     * @param bool $humid_mode  True if the new campaign happened in a humid environment
     * @param bool $enable_fibox_temp  True if the new campaign take the temperature of the fibox
     * @return int
     */
    public function addCampaign(int $config_id, string $name, bool $temperatureSensor, bool $CO2Sensor, bool $O2Sensor, bool $luminositySensor, bool $humiditySensor, int $interval, ?float $volume, int $duration, bool $humid_mode, bool $enable_fibox_temp) : int
    {
        try {
            if (self::existCampaign($name)) {
                throw new Exception("Une campagne de mesure avec le même nom existe déjà. Veuillez en choisir un autre.");
            }

            $this->db->fetchAll("INSERT INTO Campaigns VALUES (NULL, :varConfigId, :varName, NOW(), :varTemperatureSensor, :varCO2Sensor, :varO2Sensor, :varLuminositySensor, :varHumiditySensor, :varInterval, :varVolume, :varDuration, :varHumidMode, :varEnableFiboxTemp, 0, 0, DATE_ADD(NOW(), INTERVAL :varDuration2 SECOND))", [
                'varConfigId' => $config_id,
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
                'varHumidMode' => (int)$humid_mode,
                'varEnableFiboxTemp' => (int)$enable_fibox_temp
            ]);

            return self::getIdCampaign($name);
        } catch (\Throwable $th) {
            throw new Exception("Impossible d'ajouter la campagne. {$th->getMessage()}");
        }
    }

    /**
     * Deletes all data of the campaign whose id is entered as a parameter
     * Returns true if all data are deleted.
     *
     * @param int $id Id of the campaign
     * @return bool
     */
    public function supprCampaign(int $id) : bool
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
            return true;
        } catch (\Throwable $th) {
            throw new Exception("Impossible de supprimer la campagne. {$th->getMessage()}");
        }
    }

    /**
     * Restarts a campaign whose id is entered as a parameter
     * Returns true if the campaign is restart.
     *
     * @param int $id Id of the campaign
     * @return bool
     */
    public function restartCampaign(int $id) : bool
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
            return true;
        } catch (\Throwable $th) {
            throw new Exception("Impossible de redémarrer la campagne. {$th->getMessage()}");
        }

        return true;
    }

    /**
     * Export of measurements from a campaign according to the parameters entered.
     *
     * @param string $id  Id of the new campaign
     * @param bool $temperatureSensor  True if the export take the temperature recorded by the campaign
     * @param bool $CO2Sensor  True if the export take the CO2 recorded by the campaign
     * @param bool $O2Sensor  True if the export take the O2 recorded by the campaign
     * @param bool $luminositySensor  True if the export take the luminosity recorded by the campaign
     * @param bool $humiditySensor  True if the export take the humidity recorded by the campaign
     * @param string $beginDate     Date of begin of measurements recovery
     * @param string $endDate   Date of end of measurements recovery
     * @return array
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
     * Description.
     *
     * @param int $id
     * @param ?string $logSinceDatetime
     * @param ?string $measureSinceDatetime
     * @return array
     */
    //Recovery of all the data of the campaign whose id is entered as a parameter
    public function getCampaign(int $id, ?string $logSinceDatetime = NULL, ?string $measureSinceDatetime = NULL) : array {
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
     * @param {string} message
     * @return {string}
     */
    public function getInfoCampaign(int $id) : array {
        try {
            $results = $this->db->fetchAll("SELECT * FROM Campaigns WHERE idCampaign = :varId", [
                'varId' => $id
            ]);

            if (count($results) > 0) {
                return $results[0];
            } else {
                throw new Exception("La campagne de mesure associé à l'identifiant donné est introuvable.");
            }
        } catch (\Throwable $th) {
            throw new Exception("Impossible de récupérer les informations de la campagne. {$th->getMessage()}");
        }
    }
}
