<?php

use Database;

class ConfigurationsManager {
    /**
     * @var ConfigurationsManager
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
        self::$db = Database::getInstance();
    }
    
    /**
     * Create unique instance of the class
     * if it doesn't exists then return it
     *
     * @param void
     * @return ConfigurationsManager
     */
    public static function getInstance() {
    
        if(is_null(self::$_instance)) {
            self::$_instance = new ConfigurationsManager();
        }
    
        return self::$_instance;
    }

    /**
     * Recovery of all configurations.
     *
     * @param array $filter Influence which configuration the public function recovers
     * @return array
     */
    public function getListConfiguration(array $filter = null) : array
    {
        $query = "SELECT * FROM Configurations ";
        $whereClauses = [];
        $parameters = [];

        if (isset($filter) && !empty($filter) && !empty($filter["name"])) {
            $query .= "WHERE ";

            if (!empty($filter["name"])) {
                array_push($whereClauses, "LOWER(name) LIKE :varName");
                $parameters["varName"] = "%" . htmlspecialchars($filter["name"]) . "%";
            }
        }

        $query .= join(" AND ", $whereClauses) . " ORDER BY name ASC";

        try {
            return self::$db->fetchAll($query, $parameters);
        } catch (\Throwable $th) {
            throw new Exception("Impossible de récupérer les campagnes. {$th->getMessage()}");
        }
    }

    /**
     * Returns the id of the configuration whose name entered in parameter matches
     *
     * @param string $name Name of a configuration
     * @return int
     */
    public function getIdConfiguration(string $name): int {
        try {
            $results = self::$db->fetchAll("SELECT idConfig FROM Configurations WHERE name = :varName", [
                'varName' => htmlspecialchars($name)
            ]);
        
            if (count($results) > 0) {
                return $results[0]["idConfig"];
            } else {
                throw new Exception("Le nom de la configuration est introuvable.");
            }
        } catch (\Throwable $th) {
            throw new Exception("Impossible de récupérer l'identifiant de la configuration. {$th->getMessage()}");
        }
    }

    /**
     * Return the name of the configuration with a given id
     *
     * @param int $id Id of a configuration
     * @return string
     */
    public function getNameConfiguration(int $id): string {
        try {
            $results = self::$db->fetchAll("SELECT name FROM Configurations WHERE idConfig = :varId", [
                'varId' => $id
            ]);
        
            if (count($results) > 0) {
                return $results[0]["name"];
            } else {
                throw new Exception("L'identifiant de la configuration est introuvable.");
            }
        } catch (\Throwable $th) {
            throw new Exception("Impossible de récupérer le nom de la configuration. {$th->getMessage()}");
        }
    }

    /**
     * Returns true if the name entered in parameter corresponds to an existing configuration.
     *
     * @param string $name Name of a configuration
     * @param int $id Id of a configuration (optional, if provided, the public function wiil exclude the configuration with this id from the check)
     * @return bool
     */
    public function existConfiguration(string $name, int $id = -1): bool {
        try {
            if ($id != -1) {
                $results = self::$db->fetchAll("SELECT idConfig FROM Configurations WHERE name = :varName AND idConfig != :varId ORDER BY 1 DESC", [
                    'varName' => htmlspecialchars($name),
                    'varId' => $id
                ]);
            } else {
                $results = self::$db->fetchAll("SELECT idConfig FROM Configurations WHERE name = :varName ORDER BY 1 DESC", [
                    'varName' => htmlspecialchars($name)
                ]);
            }
        
            if (count($results) > 0) {
                return true;
            } else {
                return false;
            }
        } catch (\Throwable $th) {
            throw new Exception("Impossible de vérifier l'existance d'une configuration par son nom. {$th->getMessage()}");
        }
    }

    /**
     * Deletes all data of the campaign whose id is entered as a parameter
     * Returns true if all data are deleted.
     *
     * @param int $id Id of the campaign
     * @return bool
     */
    public function supprConfiguration(int $id) : bool
    {
        //Update any campaign related
        try {
            self::$db->fetchAll("UPDATE Campaigns SET idConfig = null WHERE idConfig = :varId", [
                'varId' => $id
            ]);
        } catch (\Throwable $th) {
            throw new Exception("Impossible de supprimer les références de la configuration pour les campagnes concernées. {$th->getMessage()}");
        }

        //Removal of the campaign
        try {
            self::$db->fetchAll("DELETE FROM Configurations WHERE idConfig = :varId", [
                'varId' => $id
            ]);
        } catch (\Throwable $th) {
            throw new Exception("Impossible de supprimer la configuration. {$th->getMessage()}");
        }

        return true;
    }

    /**
     * Add a configuration into the database
     * Returns true if no errors occured
     *
     * @param string name Name of the configuration
     * @param float f1 Constant
     * @param float m Constant
     * @param float dPhi1 Constant
     * @param float dPhi2 Constant
     * @param float dKSV1 Constant
     * @param float dKSV2 Constant
     * @param float cal0 Constant
     * @param float cal2nd Constant
     * @param float t0 Constant
     * @param float t2nd Constant
     * @param int pressure Constant
     * @param int o2cal2nd Constant
     * @param int altitude Altitude for the configuration
     * @param bool calib_is_humid If calib has been done in humid conditions
     */
    public function addConfiguration(string $name, float $f1, float $m, float $dPhi1, float $dPhi2, float $dKSV1, float $dKSV2, float $cal0, float $cal2nd, float $t0, float $t2nd, int $pressure, int $o2cal2nd, int $altitude, bool $calib_is_humid) : bool
    {
        try {
            if (self::existConfiguration($name)) {
                throw new Exception("Une configuration avec le même nom existe déjà. Veuillez en choisir un autre.");
            }

            self::$db->fetchAll("INSERT INTO Configurations VALUES (NULL, :varName, :varAltitude, :varF1, :varM, :varDPhi1, :varDPhi2, :varDKSV1, :varDKSV2, :varPressure, :varCalibIsHumid, :varCal0, :varCal2nd, :varO2Cal2nd, :varT0, :varT2nd)", [
                'varName' => htmlspecialchars($name),
                'varF1' => $f1,
                'varM' => $m,
                'varDPhi1' => $dPhi1,
                'varDPhi2' => $dPhi2,
                'varDKSV1' => $dKSV1,
                'varDKSV2' => $dKSV2,
                'varCal0' => $cal0,
                'varCal2nd' => $cal2nd,
                'varT0' => $t0,
                'varT2nd' => $t2nd,
                'varPressure' => $pressure,
                'varO2Cal2nd' => $o2cal2nd,
                'varAltitude' => $altitude,
                'varCalibIsHumid' => (int)$calib_is_humid
            ]);

            return true;
        } catch (\Throwable $th) {
            throw new Exception("Impossible d'ajouter la configuration. {$th->getMessage()}");
        }
    }

    /**
     * Add a configuration into the database
     * Returns true if no errors occured
     *
     * @param string name Name of the configuration
     * @param float f1 Constant
     * @param float m Constant
     * @param float dPhi1 Constant
     * @param float dPhi2 Constant
     * @param float dKSV1 Constant
     * @param float dKSV2 Constant
     * @param float cal0 Constant
     * @param float cal2nd Constant
     * @param float t0 Constant
     * @param float t2nd Constant
     * @param int pressure Constant
     * @param int o2cal2nd Constant
     * @param int altitude Altitude for the configuration
     * @param bool calib_is_humid If calib has been done in humid conditions
     */
    public function editConfiguration(int $id, string $name, float $f1, float $m, float $dPhi1, float $dPhi2, float $dKSV1, float $dKSV2, float $cal0, float $cal2nd, float $t0, float $t2nd, int $pressure, int $o2cal2nd, int $altitude, bool $calib_is_humid) : bool
    {
        try {
            if (self::existConfiguration($name, $id)) {
                throw new Exception("Une configuration avec le même nom existe déjà. Veuillez en choisir un autre.");
            }

            self::$db->fetchAll("UPDATE Configurations SET name = :varName, altitude = :varAltitude, f1 = :varF1, m = :varM, dPhi1 = :varDPhi1, dPhi2 = :varDPhi2, dKSV1 = :varDKSV1, dKSV2 = :varDKSV2, pressure = :varPressure, calibIsHumid = :varCalibIsHumid, cal0 = :varCal0, cal2nd = :varCal2nd, o2Cal2nd = :varO2Cal2nd, t0 = :varT0, t2nd = :varT2nd WHERE idConfig = :varId", [
                'varName' => htmlspecialchars($name),
                'varF1' => $f1,
                'varM' => $m,
                'varDPhi1' => $dPhi1,
                'varDPhi2' => $dPhi2,
                'varDKSV1' => $dKSV1,
                'varDKSV2' => $dKSV2,
                'varCal0' => $cal0,
                'varCal2nd' => $cal2nd,
                'varT0' => $t0,
                'varT2nd' => $t2nd,
                'varPressure' => $pressure,
                'varO2Cal2nd' => $o2cal2nd,
                'varAltitude' => $altitude,
                'varCalibIsHumid' => (int)$calib_is_humid,
                'varId' => $id
            ]);
            
            return true;
        } catch (\Throwable $th) {
            throw new Exception("Impossible de modifier la configuration. {$th->getMessage()}");
        }
    }

    /**
     * Get the configuration from the database with a given id
     *
     * @param int id
     * @return array
     */
    public function getConfiguration(int $id) : array {
        try {
            $results = self::$db->fetchAll("SELECT * FROM Configurations WHERE idConfig = :varId", [
                'varId' => $id
            ]);

            if (count($results) > 0) {
                return $results[0];
            } else {
                throw new Exception("La configuration associé à l'identifiant donné est introuvable.");
            }
        } catch (\Throwable $th) {
            throw new Exception("Impossible de récupérer les informations de la configuration. {$th->getMessage()}");
        }
    }
}
