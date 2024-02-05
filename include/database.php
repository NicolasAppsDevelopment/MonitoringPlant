<?php

include_once __DIR__ . "/../include/reply.php";

//Connection to database
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


//Preparing and executing a SQL query
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

//Recovery of all measurement campaigns
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

//Returns the id of the campaign whose name entered in parameter matches
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

//Returns true if the name entered in parameter corresponds to an existing campaign
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

//Creates a campaign according to the parameters entered
function addCampaign(string $name,bool $temperatureSensor,bool $CO2Sensor,bool $O2Sensor,bool $luminositySensor,bool $humiditySensor,int $interval, ?float $volume, int $duration) : int
{
    try {
        if (existCampagne($name)) {
            throw new Exception("Une campagne de mesure avec le même nom existe déjà. Veuillez en choisir un autre.");
        }

        fetchAll("INSERT INTO Campaigns VALUES (NULL, :varName, NOW(), :varTemperatureSensor, :varCO2Sensor, :varO2Sensor, :varLuminositySensor, :varHumiditySensor, :varInterval, :varVolume, :varDuration, 0, 0, DATE_ADD(NOW(), INTERVAL :varDuration2 SECOND))", [
            'varName' => htmlspecialchars($name),
            'varTemperatureSensor' => (int)$temperatureSensor,
            'varCO2Sensor' => (int)$CO2Sensor,
            'varO2Sensor' => (int)$O2Sensor,
            'varLuminositySensor' => (int)$luminositySensor,
            'varHumiditySensor' => (int)$humiditySensor,
            'varInterval' => $interval,
            'varVolume' => $volume,
            'varDuration' => $duration,
            'varDuration2' => $duration,
        ]);

        return getIdCampagne($name);
    } catch (\Throwable $th) {
        replyError("Impossible d'ajouter la campagne", $th->getMessage());
    }
}

//Deletes measurements from the campaign whose id is entered as a parameter
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

//Deletes logs from the campaign whose id is entered as a parameter
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

//Deletes all data of the campaign whose id is entered as a parameter
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

//Restarts a campaign whose id is entered as a parameter 
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

//Deletes all data in the measurement cell (reset of the measurement cell)
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
}

//Export of measurements from a campaign according to the parameters entered
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

//Recovery of all the data of the campaign whose id is entered as a parameter
function getCampaign(int $id, ?string $logSinceDatetime = NULL, ?string $measureSinceDatetime = NULL) : array {
    try {
        return array(
            "campaignInfo" => getInfoCampaign($id),
            "measurements" => getMeasurements($id, $measureSinceDatetime),
            "logs" => getLogs($id, $logSinceDatetime)
        );
    } catch (\Throwable $th) {
        replyError("Impossible de récupérer les données de la campagne", $th->getMessage());
    }
}

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

//Recovery of Raspbery Pi settings
function getParametre() : array
{
    try {
        $data = fetchAll("SELECT * , NOW() AS 'date' FROM Settings");
        if (count($data) > 0) {
            return $data[0];
        } else {
            header("Location: /demarrage.php");
            return [];
        }
    } catch (\Throwable $th) {
        replyError("Impossible de récupérer les paramètres du Raspberry Pi", $th->getMessage());       
    }
}

//Defines new Raspbery Pi settings
function postParametres(int $supprInterval, int $enabled) : array
{
    try {
        fetchAll("DELETE FROM Settings");
        fetchAll("INSERT INTO Settings VALUES(:varSuppr, :varEnabled);", [
            'varSuppr' => (int)$supprInterval,
            'varEnabled' =>(int)$enabled
        ]);
        return array("succes"=>true);
    } catch (\Throwable $th) {
        replyError("Impossible de modifier les paramètres", $th->getMessage());
    }
}
