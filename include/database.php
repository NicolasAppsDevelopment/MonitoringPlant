<?php

include_once __DIR__ . "/../include/reply.php";


/**
 * Connection to database.
 * 
 * @return PDO
 */
function initDataBase() : PDO
{
    $dsn = "mysql:dbname=phase1;host=localhost";
    $user = "quentin";
    $password = "password";

    try {
        return new PDO($dsn, $user, $password);
    } catch (PDOException $e) {
        replyError("Impossible de se connecter à la base de données", $e->getMessage());
    }
}

global $PDO;
$PDO = initDataBase();
$PDO->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
$PDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

/**
 * Preparing and executing a SQL query.
 * 
 * @param string $query Query who need to be execute
 * @param string $parameters Parameter(s) of the query
 * @return array
 */
function fetchAll(string $query, array $parameters = []) : array {
    global $PDO;
    if (!$PDO){
        throw new Exception("La connexion à la base de donnée a échoué.");
    }

    $statement = $PDO->prepare($query);

    if (!$statement) {
        throw new Exception("La préparation de la requête a échouée. Erreur SQLSTATE " . $PDO->errorInfo()[0] . " : " . $PDO->errorInfo()[2]);
    }

    $statement->execute($parameters);

    return $statement->fetchAll();
}


/**
 * Recovery of all measurement campaigns.
 * 
 * @param array $filter Influence which campaigns the function recovers
 * @return array
 */
function getListCampaign(array $filter = null) : array
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
        return fetchAll($query, $parameters);
    } catch (\Throwable $th) {
        replyError("Impossible de récupérer les campagnes", $th->getMessage());
    }
}


/**
 * Returns the id of the campaign whose name entered in parameter matches
 * 
 * @param string $name Name of a campaign
 * @return int
 */
function getIdCampagne(string $name): int {
    try {
        $results = fetchAll("SELECT idCampaign FROM Campaigns WHERE name = :varName ORDER BY 1 DESC", [
            'varName' => htmlspecialchars($name)
        ]);
    
        if (count($results) > 0) {
            return $results[0]["idCampaign"];
        } else {
            throw new Exception("Le nom de la campagne de mesure est introuvable.");
        }
    } catch (\Throwable $th) {
        replyError("Impossible de récupérer l'identifiant de la campagne", $th->getMessage());
    }
}


/**
 * Returns true if the name entered in parameter corresponds to an existing campaign.
 * 
 * @param string $name Name of a campaign
 * @return bool
 */
function existCampagne(string $name): bool {
    try {
        $results = fetchAll("SELECT idCampaign FROM Campaigns WHERE name = :varName ORDER BY 1 DESC", [
            'varName' => htmlspecialchars($name)
        ]);
    
        if (count($results) > 0) {
            return true;
        } else {
            return false;
        }
    } catch (\Throwable $th) {
        replyError("Impossible de vérifier l'existance d'une campagne par son nom.", $th->getMessage());
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
function addCampaign(int $config_id, string $name, bool $temperatureSensor, bool $CO2Sensor, bool $O2Sensor, bool $luminositySensor, bool $humiditySensor, int $interval, ?float $volume, int $duration, bool $humid_mode, bool $enable_fibox_temp) : int
{
    try {
        if (existCampagne($name)) {
            throw new Exception("Une campagne de mesure avec le même nom existe déjà. Veuillez en choisir un autre.");
        }

        fetchAll("INSERT INTO Campaigns VALUES (NULL, :varConfigId, :varName, NOW(), :varTemperatureSensor, :varCO2Sensor, :varO2Sensor, :varLuminositySensor, :varHumiditySensor, :varInterval, :varVolume, :varDuration, :varHumidMode, :varEnableFiboxTemp, 0, 0, DATE_ADD(NOW(), INTERVAL :varDuration2 SECOND))", [
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

        return getIdCampagne($name);
    } catch (\Throwable $th) {
        replyError("Impossible d'ajouter la campagne", $th->getMessage());
    }
}


/**
 * Deletes measurements from the campaign whose id is entered as a parameter
 * Returns true if the measurements are deleted.
 * 
 * @param int $id Id of the campaign
 * @return bool
 */
function supprMeasurements(int $id) : bool
{
    //Removal of measurements
    try {
        fetchAll("DELETE FROM Measurements WHERE idCampaign = :varId", [
            'varId' => $id
        ]);
        return true;
    } catch (\Throwable $th) {
        replyError("Impossible de supprimer les mesures de la campagne", $th->getMessage());
    }
}


/**
 * Deletes logs from the campaign whose id is entered as a parameter
 * Returns true if the logs are deleted.
 * 
 * @param int $id Id of the campaign
 * @return bool
 */
function supprLogs(int $id) : bool
{
    //Removal of logs
    try {
        fetchAll("DELETE FROM Logs WHERE idCampaign = :varId", [
            'varId' => $id
        ]);
        return true;
    } catch (\Throwable $th) {
        replyError("Impossible de supprimer les logs de la campagne", $th->getMessage());
    }
} 


/**
 * Deletes all data of the campaign whose id is entered as a parameter
 * Returns true if all data are deleted.
 * 
 * @param int $id Id of the campaign
 * @return bool
 */
function supprCampaign(int $id) : bool
{
    //Removal of measurements
    supprMeasurements($id);

    //Removal of logs
    supprLogs($id);

    //Removal of the campaign
    try {
        fetchAll("DELETE FROM Campaigns WHERE idCampaign = :varId", [
            'varId' => $id
        ]);
        return true;
    } catch (\Throwable $th) {
        replyError("Impossible de supprimer la campagne", $th->getMessage());
    }
}


/**
 * Restarts a campaign whose id is entered as a parameter
 * Returns true if the campaign is restart.
 * 
 * @param int $id Id of the campaign
 * @return bool
 */
function restartCampaign(int $id) : bool
{
    //Removal of measurements
    supprMeasurements($id);

    //Removal of logs
    supprLogs($id);

    //Update campaign start and end dates
    try {
        fetchAll("UPDATE Campaigns SET beginDate=NOW(), endingDate=DATE_ADD(NOW(),INTERVAL duration SECOND) WHERE idCampaign = :varId", [
            'varId' => $id
        ]);
        return true;
    } catch (\Throwable $th) {
        replyError("Impossible de modifier la campagne", $th->getMessage());
    }

    return true;
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
        fetchAll("DELETE FROM Settings");
    } catch (\Throwable $th) {
        replyError("Impossible de supprimer les paramètres du Raspbery Pi", $th->getMessage());
    }

    //Removal of measurements
    try {
        fetchAll("DELETE FROM Measurements");
    } catch (\Throwable $th) {
        replyError("Impossible de supprimer les mesures des campagnes", $th->getMessage());
    }

    //Removal of logs
    try {
        fetchAll("DELETE FROM Logs");
    } catch (\Throwable $th) {
        replyError("Impossible de supprimer les logs", $th->getMessage());
    }

    //Removal of campaigns
    try {
        fetchAll("DELETE FROM Campaigns");
        return true;
    } catch (\Throwable $th) {
        replyError("Impossible de supprimer les campagnes", $th->getMessage());
    }

    //Removal of configurations
    try {
        fetchAll("DELETE FROM Configurations");
    } catch (\Throwable $th) {
        replyError("Impossible de supprimer les configurations", $th->getMessage());
    }
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
function exportCampaign(int $id, bool $temperatureSensor, bool $CO2Sensor, bool $O2Sensor, bool $luminositySensor, bool $humiditySensor, string $beginDate, string $endDate) : array
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
        return fetchAll($query, $parameters);
    } catch (\Throwable $th) {
        replyError("Impossible de récupérer les données de la campagnes", $th->getMessage());
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
function getCampaign(int $id, ?string $logSinceDatetime = NULL, ?string $measureSinceDatetime = NULL) : array {
    try {
        $campaignInfo = getInfoCampaign($id);
        try {
            $campaignInfo["nameConfig"] = getNameConfiguration($campaignInfo["idConfig"]);
        } catch (\Throwable $th) {
            $campaignInfo["nameConfig"] = "Configuration supprimée";
        }

        return array(
            "campaignInfo" => $campaignInfo,
            "measurements" => getMeasurements($id, $measureSinceDatetime),
            "logs" => getLogs($id, $logSinceDatetime)
        );
    } catch (\Throwable $th) {
        replyError("Impossible de récupérer les données de la campagne", $th->getMessage());
    }
}


/**
 * Description.
 * 
 * @param {string} message
 * @return {string}
 */
//Recovery of general information about the campaign whose id is entered as a parameter
function getInfoCampaign(int $id) : array {
    try {
        $results = fetchAll("SELECT * FROM Campaigns WHERE idCampaign = :varId", [
            'varId' => $id
        ]);

        if (count($results) > 0) {
            return $results[0];
        } else {
            throw new Exception("La campagne de mesure associé à l'identifiant donné est introuvable.");
        }
    } catch (\Throwable $th) {
        replyError("Impossible de récupérer les informations de la campagne", $th->getMessage());
    }
}


/**
 * Description.
 * 
 * @param {string} message
 * @return {string}
 */
//Recovery of logs of the campaign whose id is entered as a parameter
function getLogs(int $id, ?string $sinceDatetime = NULL) : array {
    try {
        $query = "SELECT * FROM Logs WHERE idCampaign = :varId";
        $parameters = [
            'varId' => $id
        ];

        if ($sinceDatetime != NULL){
            $query .= " AND occuredDate > :fromDate";
            $parameters["fromDate"] = $sinceDatetime;
        }

        return fetchAll($query, $parameters);
    } catch (\Throwable $th) {
        replyError("Impossible de récupérer l'historique des évenements de la campagne", $th->getMessage());
    }
}


/**
 * Description.
 * 
 * @param {string} message
 * @return {string}
 */
//Recovery of measurements of the campaign whose id is entered as a parameter
function getMeasurements(int $id, ?string $sinceDatetime = NULL) : array {
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

        return fetchAll($query, $parameters);
    } catch (\Throwable $th) {
        replyError("Impossible de récupérer les données de mesure de la campagnes", $th->getMessage());
    }
}


/**
 * Description.
 * 
 * @param {string} message
 * @return {string}
 */
//Recovery of Raspbery Pi settings
function getParametersPHP() : array
{
    try {
        $data = fetchAll("SELECT * , NOW() AS 'date' FROM Settings");
        if (count($data) > 0) {
            return $data[0];
        } else {
            header("Location: /beginning.php");
            return [];
        }
    } catch (\Throwable $th) {
        replyError("Impossible de récupérer les paramètres du Raspberry Pi", $th->getMessage());       
    }
}


/**
 * Description.
 * 
 * @param {string} message
 * @return {string}
 */
//Defines new Raspbery Pi settings
function setParametersPHP(int $supprInterval, bool $enabled) : bool
{
    try {
        fetchAll("DELETE FROM Settings");
        fetchAll("INSERT INTO Settings VALUES (:varSuppr, :varEnabled)", [
            'varSuppr' => $supprInterval,
            'varEnabled' => (int)$enabled
        ]);
        return true;
    } catch (\Throwable $th) {
        replyError("Impossible de modifier les paramètres", $th->getMessage());
    }
}


/*
 * PARTIE CONFIG
 */

/**
 * Recovery of all configurations.
 * 
 * @param array $filter Influence which configuration the function recovers
 * @return array
 */
function getListConfiguration(array $filter = null) : array
{
    $query = "SELECT * FROM Configurations ";
    $whereClauses = [];
    $parameters = []; 

    if (isset($filter) && !empty($filter)) {
        if (!empty($filter["name"])) {

            $query .= "WHERE ";

            if (!empty($filter["name"])) {
                array_push($whereClauses, "LOWER(name) LIKE :varName");
                $parameters["varName"] = "%" . htmlspecialchars($filter["name"]) . "%";
            }
        }
    }

    $query .= join(" AND ", $whereClauses) . " ORDER BY name ASC";

    try {
        return fetchAll($query, $parameters);
    } catch (\Throwable $th) {
        replyError("Impossible de récupérer les campagnes", $th->getMessage());
    }
}

/**
 * Returns the id of the configuration whose name entered in parameter matches
 * 
 * @param string $name Name of a configuration
 * @return int
 */
function getIdConfiguration(string $name): int {
    try {
        $results = fetchAll("SELECT idConfig FROM Configurations WHERE name = :varName", [
            'varName' => htmlspecialchars($name)
        ]);
    
        if (count($results) > 0) {
            return $results[0]["idConfig"];
        } else {
            throw new Exception("Le nom de la configuration est introuvable.");
        }
    } catch (\Throwable $th) {
        replyError("Impossible de récupérer l'identifiant de la configuration", $th->getMessage());
    }
}

/**
 * Return the name of the configuration with a given id
 * 
 * @param int $id Id of a configuration
 * @return string
 */
function getNameConfiguration(int $id): string {
    try {
        $results = fetchAll("SELECT name FROM Configurations WHERE idConfig = :varId", [
            'varId' => $id
        ]);
    
        if (count($results) > 0) {
            return $results[0]["name"];
        } else {
            throw new Exception("L'identifiant de la configuration est introuvable.");
        }
    } catch (\Throwable $th) {
        replyError("Impossible de récupérer le nom de la configuration", $th->getMessage());
    }
}

/**
 * Returns true if the name entered in parameter corresponds to an existing configuration.
 * 
 * @param string $name Name of a configuration
 * @param int $id Id of a configuration (optional, if provided, the function wiil exclude the configuration with this id from the check)
 * @return bool
 */
function existConfiguration(string $name, int $id = -1): bool {
    try {
        if ($id != -1) {
            $results = fetchAll("SELECT idConfig FROM Configurations WHERE name = :varName AND idConfig != :varId ORDER BY 1 DESC", [
                'varName' => htmlspecialchars($name),
                'varId' => $id
            ]);
        } else {
            $results = fetchAll("SELECT idConfig FROM Configurations WHERE name = :varName ORDER BY 1 DESC", [
                'varName' => htmlspecialchars($name)
            ]);
        }
    
        if (count($results) > 0) {
            return true;
        } else {
            return false;
        }
    } catch (\Throwable $th) {
        replyError("Impossible de vérifier l'existance d'une configuration par son nom.", $th->getMessage());
    }
}

/**
 * Deletes all data of the campaign whose id is entered as a parameter
 * Returns true if all data are deleted.
 * 
 * @param int $id Id of the campaign
 * @return bool
 */
function supprConfiguration(int $id) : bool
{
    //Update any campaign related
    try {
        fetchAll("UPDATE Campaigns SET idConfig = null WHERE idConfig = :varId", [
            'varId' => $id
        ]);
    } catch (\Throwable $th) {
        replyError("Impossible de supprimer les références de la configuration pour les campagnes concernées", $th->getMessage());
    }

    //Removal of the campaign
    try {
        fetchAll("DELETE FROM Configurations WHERE idConfig = :varId", [
            'varId' => $id
        ]);
    } catch (\Throwable $th) {
        replyError("Impossible de supprimer la configuration", $th->getMessage());
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
function addConfiguration(string $name, float $f1, float $m, float $dPhi1, float $dPhi2, float $dKSV1, float $dKSV2, float $cal0, float $cal2nd, float $t0, float $t2nd, int $pressure, int $o2cal2nd, int $altitude, bool $calib_is_humid) : bool
{
    try {
        if (existConfiguration($name)) {
            throw new Exception("Une configuration avec le même nom existe déjà. Veuillez en choisir un autre.");
        }

        fetchAll("INSERT INTO Configurations VALUES (NULL, :varName, :varAltitude, :varF1, :varM, :varDPhi1, :varDPhi2, :varDKSV1, :varDKSV2, :varPressure, :varCalibIsHumid, :varCal0, :varCal2nd, :varO2Cal2nd, :varT0, :varT2nd)", [
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
        replyError("Impossible d'ajouter la configuration.", $th->getMessage());
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
function editConfiguration(int $id, string $name, float $f1, float $m, float $dPhi1, float $dPhi2, float $dKSV1, float $dKSV2, float $cal0, float $cal2nd, float $t0, float $t2nd, int $pressure, int $o2cal2nd, int $altitude, bool $calib_is_humid) : bool
{
    try {
        if (existConfiguration($name, $id)) {
            throw new Exception("Une configuration avec le même nom existe déjà. Veuillez en choisir un autre.");
        }

        fetchAll("UPDATE Configurations SET name = :varName, altitude = :varAltitude, f1 = :varF1, m = :varM, dPhi1 = :varDPhi1, dPhi2 = :varDPhi2, dKSV1 = :varDKSV1, dKSV2 = :varDKSV2, pressure = :varPressure, calibIsHumid = :varCalibIsHumid, cal0 = :varCal0, cal2nd = :varCal2nd, o2Cal2nd = :varO2Cal2nd, t0 = :varT0, t2nd = :varT2nd WHERE idConfig = :varId", [
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
        replyError("Impossible de modifier la configuration.", $th->getMessage());
    }
}

/**
 * Get the configuration from the database with a given id
 * 
 * @param int id
 * @return array
 */
function getConfiguration(int $id) : array {
    try {
        $results = fetchAll("SELECT * FROM Configurations WHERE idConfig = :varId", [
            'varId' => $id
        ]);

        if (count($results) > 0) {
            return $results[0];
        } else {
            throw new Exception("La configuration associé à l'identifiant donné est introuvable.");
        }
    } catch (\Throwable $th) {
        replyError("Impossible de récupérer les informations de la configuration", $th->getMessage());
    }
}