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

    $query = "SELECT * FROM CampagneMesure ";
    $params = []; 

    if (isset($filter) && !empty($filter)) {
        $query .= "WHERE ";

        if (isset($filter["processing"]) && !empty($filter["processing"]) && $filter["processing"] == true) {
            $query .= "etat = 1 ";
        }
    
        if (isset($filter["date"]) && !empty($filter["date"])) {
            $query .= "DateDebut = DATE(:varDate) ";
            $params["varDate"] = $filter["date"];
        }
    
        if (isset($filter["time"]) && !empty($filter["time"])) {
            $query .= "DateDebut = TIME(:varTime) ";
            $params["varDate"] = $filter["date"];
        }
    } 

    $query .= "ORDER BY DateDebut DESC";

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

function getIdCampagne(string $nom):int{
        if (!PDO){
            throw new Exception("La connexion à la base de donnée a échoué.");
        }
        
        $statement = PDO->prepare("SELECT idCampagne from CampagneMesure where nom=:nom ORDER BY 1 DESC");
        $statement->execute(
            [
                'nom' => htmlspecialchars($nom)
            ]
        );

        $res = $statement->fetchAll();

        if (count($res) > 0) {
            return $res[0]["idCampagne"];
        } else {
            throw new Exception("Nom introuvable.");
        }
} 

function addCampaign(string $nom,bool $capteurTemperature,bool $capteurCO2,bool $capteurO2,bool $capteurLumiere,bool $capteurHumidite,int $intervalReleve, float | null $volume,int $duree) : int | null
{
    if (!PDO){
        replyError("Impossible d'ajouter la campagne", "La connexion à la base de donnée a échoué.");
        return null;
    }

    try {
        $statement = PDO->prepare("INSERT into CampagneMesure values (null,:nom,now(),:capteurTemperature,:capteurCO2,:capteurO2,:capteurLumiere,:capteurHumidite,:intervalReleve,:volume,:duree,0)");
        $statement->execute(
            [
                'nom' => htmlspecialchars($nom),
                'capteurTemperature' => (int)$capteurTemperature,
                'capteurCO2' => (int)$capteurCO2,
                'capteurO2' => (int)$capteurO2,
                'capteurLumiere' => (int)$capteurLumiere,
                'capteurHumidite' => (int)$capteurHumidite,
                'intervalReleve' => $intervalReleve,
                'volume' => $volume,
                'duree' => $duree
            ]
        );
        $statement->fetchAll();

        return getIdCampagne($nom);
    } catch (\Throwable $th) {
        replyError("Impossible d'ajouter la campagne", $th->getMessage());
    }

    return null;
}

function supprCampagne (int $id) : bool
{
    if (!PDO){
        replyError("Impossible de supprimer la campagne", "La connexion à la base de donnée a échoué.");
        return false;
    }

    // Suppression des mesures
    try {
        $statement = PDO->prepare("DELETE from Mesure where idCampagne = :id");
        $statement->execute(
            [
                'id' => $id
            ]
        );
    } catch (\Throwable $th) {
        replyError("Impossible de supprimer les mesures de la campagne", $th->getMessage());
    }

    // Suppression des logs
    // ...

    // Suppression de la campagne
    try {
        $statement = PDO->prepare("DELETE from CampagneMesure where idCampagne=:id");
        $statement->execute(
            [
                'id' => $id
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

function exportCampaign(int $id,bool $capteurTemperature,bool $capteurCO2,bool $capteurO2,bool $capteurLumiere,bool $capteurHumidite,datetime $debut,datetime $fin) : array | null
{
    if (!PDO){
        replyError("Impossible de récupérer la campagne", "La connexion à la base de donnée a échoué.");
        return null;
    }

    $query = "SELECT";
    
    if ($capteurTemperature){
	    $query.="Temperature,";
    }
    if ($capteurCO2){
        $query.="CO2,";
    }
    if ($capteurO2){
        $query.="O2,";
    }
    if ($capteurLumiere){
        $query.="Lumiere,";
    }
    if ($capteurHumidite){
        $query.="Humidite,";
    }

    $query.="DateHeure from Mesure where idCampagne=:id and DateHeure<:fin and DateHeure>:debut;";

    try {
        $statement = PDO->prepare($query);
        $statement->execute(
            [
                'id' => $id,
                'fin' => $fin,
                'debut' => $debut
                
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
        $statement = PDO->prepare("SELECT * FROM CampagneMesure where idCampagne=:id");
        $statement->execute(
            [
                'id' => $id,    
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
        $statement = PDO->prepare("SELECT * FROM Mesure where idCampagne=:id ORDER BY DateHeure ASC");
        $statement->execute(
            [
                'id' => $id,    
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
        $statement = PDO->prepare("select * from Parametre");
        $statement->execute();

        $data = $statement->fetch();
        return $data;

    } catch (\Throwable $th) {
        replyError("Impossible de récupérer les données de la campagnes", $th->getMessage());
    }
    return null;
}

function postParametre(int $IntervalSuppression, bool $actif) : array | null
{
    if (!PDO){
        replyError("Impossible de récupérer les campagnes", "La connexion à la base de donnée a échoué.");
        return null;
    }

    try {
        $statement = PDO->prepare("insert into Parametre value($IntervalSuppression, $actif);");
        $statement->execute();

    } catch (\Throwable $th) {
        replyError("Impossible d'insérer les données de la campagnes", $th->getMessage());
    }
    return null;
}