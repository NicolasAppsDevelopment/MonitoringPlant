<?php

include_once __DIR__ . "/../include/reply.php";

function init_db() : PDO | null 
{
    $dsn = "mysql:dbname=p2201232;host=iutbg-lamp.univ-lyon1.fr";
    $user = "p2201232";
    $password = "12201232";

    try {
        return new PDO($dsn, $user, $password);
    } catch (PDOException $e) {
        replyError("Impossible de se connecter à la base de données", $e->getMessage());
        return null;
    }
}

define("PDO", init_db());

function getListCampaign(array $filter = null) : array | null
{
    if (!PDO){
        replyError("Impossible de récupérer les campagnes", "La connexion à la base de donnée a échoué.");
        return null;
    }

    $query = "SELECT * FROM Campaigns ";
    $whereClauses = [];
    $params = []; 



    if (isset($filter) && !empty($filter)) {
        if (!empty($filter["name"]) || !empty($filter["time"]) || !empty($filter["date"]) || $filter["processing"] == true) {

            $query .= "WHERE ";

            if (!empty($filter["name"])) {
                array_push($whereClauses, "name LIKE :varName");
                $params["varName"] = "%" . $filter["name"] . "%";
            }
    
            if ($filter["processing"] == true) {
                array_push($whereClauses, "state = 0");
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

    $query .= join(" AND ", $whereClauses) . " ORDER BY beginDate DESC";

    try {
        $statement = PDO->prepare($query);

        $statement->execute($params);

        $campaigns = $statement->fetchAll();
        return $campaigns;
    } catch (\Throwable $th) {
        replyError("Impossible de récupérer les campagnes", $th->getMessage());
    }
    
    return null;
}

function getIdCampagne(string $name):int{
        if (!PDO){
            throw new Exception("La connexion à la base de donnée a échoué.");
        }
        
        $statement = PDO->prepare("SELECT idCampaign from Campaigns where name = :varName ORDER BY 1 DESC");
        $statement->execute(
            [
                'varName' => htmlspecialchars($name)
            ]
        );

        $res = $statement->fetchAll();

        if (count($res) > 0) {
            return $res[0]["idCampaign"];
        } else {
            throw new Exception("Nom introuvable.");
        }
} 

function addCampaign(string $name,bool $temperatureSensor,bool $CO2Sensor,bool $O2Sensor,bool $luminositySensor,bool $humiditySensor,int $interval, float | null $volume, int $duration) : int | null
{
    if (!PDO){
        replyError("Impossible d'ajouter la campagne", "La connexion à la base de donnée a échoué.");
        return null;
    }

    try {
        $statement = PDO->prepare("INSERT into Campaigns values (null,:varName,now(),:varTemperatureSensor,:varCO2Sensor,:varO2Sensor,:varLuminositySensor,:varHumiditySensor,:varInterval,:varVolume,:varDuration,0)");
        $statement->execute(
            [
                'varName' => htmlspecialchars($name),
                'varTemperatureSensor' => (int)$temperatureSensor,
                'varCO2Sensor' => (int)$CO2Sensor,
                'varO2Sensor' => (int)$O2Sensor,
                'varLuminositySensor' => (int)$luminositySensor,
                'varHumiditySensor' => (int)$humiditySensor,
                'varInterval' => $interval,
                'varVolume' => $volume,
                'varDuration' => $duration
            ]
        );
        $statement->fetchAll();

        return getIdCampagne($name);
    } catch (\Throwable $th) {
        replyError("Impossible d'ajouter la campagne", $th->getMessage());
    }

    return null;
}

function supprCampagne(int $id) : bool
{
    if (!PDO){
        replyError("Impossible de supprimer la campagne", "La connexion à la base de donnée a échoué.");
        return false;
    }

    // Suppression des mesures
    try {
        $statement = PDO->prepare("DELETE from Measurements where idCampaign = :varId");
        $statement->execute(
            [
                'varId' => $id
            ]
        );
    } catch (\Throwable $th) {
        replyError("Impossible de supprimer les mesures de la campagne", $th->getMessage());
    }

    // Suppression des logs
    // ...

    // Suppression de la campagne
    try {
        $statement = PDO->prepare("DELETE from Campaigns where idCampaign = :varId");
        $statement->execute(
            [
                'varId' => $id
            ]
        );

        if ($statement->rowCount() == 1){
            return true;
        } else {
            throw new Exception("Campagne introuvable.");
        }
    } catch (\Throwable $th) {
        replyError("Impossible de supprimer la campagne", $th->getMessage());
    }
    return false;
}

function exportCampaign(int $id, bool $temperatureSensor, bool $CO2Sensor, bool $O2Sensor, bool $luminositySensor, bool $humiditySensor, datetime $beginDate, datetime $endDate) : array | null
{
    if (!PDO){
        replyError("Impossible de récupérer la campagne", "La connexion à la base de donnée a échoué.");
        return null;
    }

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
    
    $query.="date FROM Measurements WHERE idCampaign = :varId AND beginDate < :varEndDate AND beginDate > :varBeginDate;";

    print($query);
    
    try {
        $statement = PDO->prepare($query);
        $statement->execute(
            [
                'varId' => $id,
                'varEndDate' => $endDate,
                'varBeginDate' => $beginDate
                
            ]
        );


        $data = $statement->fetchAll();
        return $data;
    } catch (\Throwable $th) {
        replyError("Impossible de récupérer les données de la campagnes", $th->getMessage());
    }
    return null;
}

function getCampaign(int $id) : array | null {
    if (!PDO){
        replyError("Impossible de récupérer les mesures de la campagne", "La connexion à la base de donnée a échoué.");
        return null;
    }
    try {
        $statement = PDO->prepare("SELECT * FROM Campaigns WHERE idCampaign = :varId");
        $statement->execute(
            [
                'varId' => $id,    
            ]
        );

        $data = $statement->fetch();
        return array(
            "campaignInfo" => $data,
            "measurements" => getMeasurements($id)
        );
    } catch (\Throwable $th) {
        replyError("Impossible de récupérer les données de la campagnes", $th->getMessage());
    }
    return null;
}

function getMeasurements(int $id) : array | null {
    if (!PDO){
        replyError("Impossible de récupérer les mesures de la campagne", "La connexion à la base de donnée a échoué.");
        return null;
    }
    try {
        $statement = PDO->prepare("SELECT * FROM Measurements where idCampaign = :varId ORDER BY date ASC");
        $statement->execute(
            [
                'varId' => $id,    
            ]
        );

        $data = $statement->fetchAll();
        return $data;
    } catch (\Throwable $th) {
        replyError("Impossible de récupérer les données de la campagnes", $th->getMessage());
    }
    return null;
}

function getParametre() : array | null
{
    if (!PDO){
        replyError("Impossible de récupérer les campagnes", "La connexion à la base de donnée a échoué.");
        return null;
    }

    try {
        $statement = PDO->prepare("SELECT * FROM Settings");
        $statement->execute();

        $data = $statement->fetch();
        return $data;

    } catch (\Throwable $th) {
        replyError("Impossible de récupérer les données de la campagnes", $th->getMessage());
    }
    return null;
}

function postParametre(int $IntervalSuppression, bool $enlabed) : array | null
{
    if (!PDO){
        replyError("Impossible de récupérer les campagnes", "La connexion à la base de donnée a échoué.");
        return null;
    }

    try {
    
        $statement = PDO->prepare("INSERT INTO Settings VALUE ($IntervalSuppression, $enlabed");
        $statement->execute();

    } catch (\Throwable $th) {
        replyError("Impossible de modifier les paramètres", $th->getMessage());
    }
    return null;
}