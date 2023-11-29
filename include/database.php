<?php

include_once __DIR__ . "/../include/reply.php";

function init_db() : PDO
{
    $dsn = "mysql:dbname=p2201232;host=iutbg-lamp.univ-lyon1.fr";
    $user = "p2201232";
    $password = "12201232";

    try {
        return new PDO($dsn, $user, $password);
    } catch (PDOException $e) {
        replyError("Impossible de se connecter à la base de données", $e->getMessage());
    }
}

global $PDO;
$PDO = init_db();
$PDO->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

function fetchAll(string $query, array $params = []) : array {
    global $PDO;
    if (!$PDO){
        throw new Exception("La connexion à la base de donnée a échoué.");
    }

    $statement = $PDO->prepare($query);

    if (!$statement) {
        throw new Exception("La préparation de la requête a échouée. Erreur SQLSTATE " . $PDO->errorInfo()[0] . " : " . $PDO->errorInfo()[2]);
    }

    $statement->execute($params);

    return $statement->fetchAll();
}

function getListCampaign(array $filter = null) : array
{
    $query = "SELECT * FROM Campaigns ";
    $whereClauses = [];
    $params = []; 

    if (isset($filter) && !empty($filter)) {
        if (!empty($filter["name"]) || !empty($filter["time"]) || !empty($filter["date"]) || $filter["processing"] == true) {

            $query .= "WHERE ";

            if (!empty($filter["name"])) {
                array_push($whereClauses, "LOWER(name) LIKE :varName");
                $params["varName"] = "%" . htmlspecialchars($filter["name"]) . "%";
            }
    
            if ($filter["processing"] == true) {
                array_push($whereClauses, "finished = 0");
            }
        
            if (!empty($filter["date"])) {
                array_push($whereClauses, "DATE_FORMAT(beginDate, '%Y-%m-%d') = :varDate");
                $params["varDate"] = $filter["date"];
            }
        
            if (!empty($filter["time"])) {
                array_push($whereClauses, "DATE_FORMAT(beginDate, '%k:%i') = :varTime");
                $params["varTime"] = $filter["time"];
            }
        }
    }

    $query .= join(" AND ", $whereClauses) . " ORDER BY finished ASC, beginDate DESC";

    try {
        return fetchAll($query, $params);
    } catch (\Throwable $th) {
        replyError("Impossible de récupérer les campagnes", $th->getMessage());
    }
}

function getIdCampagne(string $name): int {
    try {
        $res = fetchAll("SELECT idCampaign FROM Campaigns WHERE name = :varName ORDER BY 1 DESC", [
            'varName' => htmlspecialchars($name)
        ]);
    
        if (count($res) > 0) {
            return $res[0]["idCampaign"];
        } else {
            throw new Exception("Le nom de la campagne de mesure est introuvable.");
        }
    } catch (\Throwable $th) {
        replyError("Impossible de récupérer l'identifiant de la campagne", $th->getMessage());
    }
}

function addCampaign(string $name,bool $temperatureSensor,bool $CO2Sensor,bool $O2Sensor,bool $luminositySensor,bool $humiditySensor,int $interval, ?float $volume, int $duration) : int
{
    try {
        fetchAll("INSERT INTO Campaigns VALUES (NULL, :varName, NOW(), :varTemperatureSensor, :varCO2Sensor, :varO2Sensor, :varLuminositySensor, :varHumiditySensor, :varInterval, :varVolume, :varDuration, 0, 0)", [
            'varName' => htmlspecialchars($name),
            'varTemperatureSensor' => (int)$temperatureSensor,
            'varCO2Sensor' => (int)$CO2Sensor,
            'varO2Sensor' => (int)$O2Sensor,
            'varLuminositySensor' => (int)$luminositySensor,
            'varHumiditySensor' => (int)$humiditySensor,
            'varInterval' => $interval,
            'varVolume' => $volume,
            'varDuration' => $duration
        ]);

        return getIdCampagne($name);
    } catch (\Throwable $th) {
        replyError("Impossible d'ajouter la campagne", $th->getMessage());
    }
}

function supprCampagne(int $id) : bool
{
    // Suppression des mesures
    try {
        fetchAll("DELETE FROM Measurements WHERE idCampaign = :varId", [
            'varId' => $id
        ]);
    } catch (\Throwable $th) {
        replyError("Impossible de supprimer les mesures de la campagne", $th->getMessage());
    }

    // Suppression des logs
    // ...

    // Suppression de la campagne
    try {
        fetchAll("DELETE FROM Campaigns WHERE idCampaign = :varId", [
            'varId' => $id
        ]);
        return true;
    } catch (\Throwable $th) {
        replyError("Impossible de supprimer la campagne", $th->getMessage());
    }
}

function exportCampaign(int $id, bool $temperatureSensor, bool $CO2Sensor, bool $O2Sensor, bool $luminositySensor, bool $humiditySensor, string $beginDate, string $endDate) : array
{
    $params = [];
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
    $params["varId"] = $id;
    
    if ($beginDate != "") {
        $query.= " AND date >= :varBeginDate";
        $params["varBeginDate"] = $beginDate;
    }
    if ($endDate != "") {
        $query.= " AND date <= :varEndDate";
        $params["varEndDate"] = $endDate;
    }

    try {
        return fetchAll($query, $params);
    } catch (\Throwable $th) {
        replyError("Impossible de récupérer les données de la campagnes", $th->getMessage());
    }
}

function getCampaign(int $id) : array {
    try {
        $res = fetchAll("SELECT * FROM Campaigns WHERE idCampaign = :varId", [
            'varId' => $id
        ]);

        if (count($res) > 0) {
            $data = $res[0];
        } else {
            throw new Exception("La campagne de mesure associé à l'identifiant donné est introuvable.");
        }

        return array(
            "campaignInfo" => $data,
            "measurements" => getMeasurements($id),
            "logs" => getLogs($id)
        );
    } catch (\Throwable $th) {
        replyError("Impossible de récupérer les données de la campagnes", $th->getMessage());
    }
}

function getLogs(int $id) : array {
    try {
        return fetchAll("SELECT * FROM Logs WHERE idCampaign = :varId", [
            'varId' => $id
        ]);
    } catch (\Throwable $th) {
        replyError("Impossible de récupérer les données des logs", $th->getMessage());
    }
}

function getMeasurements(int $id) : array {
    try {
        return fetchAll("SELECT * FROM Measurements WHERE idCampaign = :varId ORDER BY date ASC", [
            'varId' => $id
        ]);
    } catch (\Throwable $th) {
        replyError("Impossible de récupérer les données de la campagnes", $th->getMessage());
    }
}

function getParametre() : array
{
    try {
        $data = fetchAll("SELECT * , NOW() AS 'date' FROM Settings");
        if (count($data) > 0) {
            return $data[0];
        } else {
            throw new Exception("Les paramètres sont introuvables.");
        }
    } catch (\Throwable $th) {
        replyError("Impossible de récupérer les données de la campagnes", $th->getMessage());
    }
}

function postParametres(int $IntervalSuppression, int $enlabed) : array
{
    try {
        fetchAll("DELETE FROM Settings");
        fetchAll("INSERT INTO Settings VALUES(:varSuppr, :varEnlabed);", [
            'varSuppr' => (int)$IntervalSuppression,
            'varEnlabed' =>(int)$enlabed
        ]);
        return array("succes"=>true);
    } catch (\Throwable $th) {
        replyError("Impossible de modifier les paramètres", $th->getMessage());
    }
}