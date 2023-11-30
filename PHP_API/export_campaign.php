<?php 
header("Content-Type: application/json; charset=utf-8");

include_once __DIR__ . "/../include/database.php";
include_once __DIR__ . "/../include/reply.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // handle POST request

    $data = file_get_contents("php://input");
	$args = json_decode($data, true);

    if (!isset($args["id"]) || !is_int($args["id"])){
        replyError("Impossible d'exporter la campagne", "L'identifiant de la campagne n'a pas été renseigné ou son format est incorrecte. Veuillez rafraîchir la page puis réessayer.");
    }

    if (!isset($args["CO2_enabled"], $args["O2_enabled"], $args["temperature_enabled"], $args["luminosity_enabled"], $args["humidity_enabled"])){
        replyError("Impossible d'exporter la campagne", "Il manque un ou plusieurs capteurs dans la requête.");
    }

    if (!is_bool($args["CO2_enabled"]) || !is_bool($args["O2_enabled"]) || !is_bool($args["temperature_enabled"]) || !is_bool($args["luminosity_enabled"]) || !is_bool($args["humidity_enabled"])){
        replyError("Impossible d'exporter la campagne", "Le format de la liste des capteurs séléctionnés est incorrecte.");
    }

    if ($args["CO2_enabled"] == false && $args["O2_enabled"] == false && $args["temperature_enabled"] == false && $args["luminosity_enabled"] == false && $args["humidity_enabled"] == false){
        replyError("Impossible d'exporter la campagne", "Aucun capteur n'a été séléctionné. Veillez séléctionner au moins un capteur puis réessayer.");
    }

    if (isset($args["interval"]) && !is_int($args["interval"])){
        replyError("Impossible d'exporter la campagne", "Le format de l'interval récupération des mesures de la campagne est incorrecte. Veuillez réessayer.");
    }

    if (isset($args["averaging"]) && !is_bool($args["averaging"])){
        replyError("Impossible d'exporter la campagne", "Le format du bouton 'moyennage' est incorrecte.");
    }

    if (isset($args["start_date"]) && !is_string($args["start_date"])){
        replyError("Impossible d'exporter la campagne", "Le format de la date de début de récupération des mesures de la campagne est incorrecte. Veuillez réessayer.");
    }

    if (isset($args["end_date"]) && !is_string($args["end_date"])){
        replyError("Impossible d'exporter la campagne", "Le format de la date de fin de récupération des mesures de la campagne est incorrecte. Veuillez réessayer.");
    }

    if (isset($args["start_time"]) && !is_string($args["start_time"])){
        replyError("Impossible d'exporter la campagne", "Le format de l'heure de début de récupération des mesures de la campagne est incorrecte. Veuillez réessayer.");
    }

    if (isset($args["end_time"]) && !is_string($args["end_time"])){
        replyError("Impossible d'exporter la campagne", "Le format de l'heure de fin de récupération des mesures de la campagne est incorrecte. Veuillez réessayer.");
    }

    if ((isset($args["start_time"]) && $args["end_date"] != "") && (!isset($args["start_date"]) || $args["start_date"] == "")){
        replyError("Impossible d'exporter la campagne", "Si vous spécifiez l'heure de début de récupération des mesures de la campagne vous devez aussi renseigner sa date. Veuillez réessayer.");
    }

    if ((isset($args["end_time"]) && $args["end_date"] != "") && (!isset($args["end_date"]) || $args["end_date"] == "")){
        replyError("Impossible d'exporter la campagne", "Si vous spécifiez la date de début de récupération des mesures de la campagne vous devez aussi renseigner sa date. Veuillez réessayer.");
    }

    if ((!isset($args["start_time"]) || $args["start_time"] == "") && isset($args["start_date"])){
        $args["start_time"] = "00:00:00";
    }

    if ((!isset($args["end_time"]) || $args["end_time"] == "") && isset($args["end_date"])){
        $args["end_time"] = "23:59:59";
    }

    $start = "";
    if (isset($args["start_time"]) && isset($args["start_date"]) && $args["start_date"] != "" && $args["start_time"] != ""){
        $start = $args["start_date"] . " " . $args["start_time"];
    }

    $end = "";
    if (isset($args["end_time"]) && isset($args["end_date"]) && $args["end_date"] != "" && $args["end_time"] != ""){
        $end = $args["end_date"] . " " . $args["end_time"];
    }

    if (isset($args["volume"]) && !is_bool($args["volume"]) ){
        replyError("Impossible d'exporter la campagne", "Le format du bouton 'volume' est incorrecte.");
    }
   
    $measurements=exportCampaign($args["id"], $args["temperature_enabled"], $args["CO2_enabled"], $args["O2_enabled"], $args["luminosity_enabled"], $args["humidity_enabled"], $start, $end);
    $info=getInfoCampaign($args["id"]);

    if ($args["volume"]==True && is_null($info["volume"])){
        replyError("Impossible d'exporter la campagne", "Aucun volume n'a été renseigné lors du démarrage de la campagne");
    }

    $nbcolmum=1+(int)$args["temperature_enabled"]+(int)$args["CO2_enabled"]+(int)$args["O2_enabled"]+(int)$args["luminosity_enabled"]+(int)$args["humidity_enabled"];
    $f=0;
    $indexLastAccepted=0;
    if(isset($args["interval"]) && isset($args["averaging"]) && $args["averaging"]==false){
        $measurementsWithInterval[$f]=$measurements[0];
        for ($i=1;$i<count($measurements)-1;$i++){
            $date1=DateTime::createFromFormat('Y-m-d H:i:s', $measurements[$indexLastAccepted][$nbcolmum-1]);
            $date2=DateTime::createFromFormat('Y-m-d H:i:s', $measurements[$i][$nbcolmum-1]);
            $interval=$date2->diff($date1);
            $total = ($interval->format('%a') * 24 * 60 * 60) + ($interval->format('%h') * 60 * 60) + ($interval->format('%i') * 60) + $interval->format('%s');
            if ($args["interval"]<=$total){
                $f++;
                $measurementsWithInterval[$f]=$measurements[$i];
                $indexLastAccepted=$i;
            } 
        } 
        $measurements=$measurementsWithInterval;  
    }

    if(isset($args["interval"]) && isset($args["averaging"]) && $args["averaging"]==true){
        $notTakenMeasurements=[];
        for ($i=0; $i <$nbcolmum-1 ; $i++) { 
            array_push($notTakenMeasurements, 0);
        }
        $nbNTM=0;
        $measurementsWithInterval[$f]=$measurements[0];
        for ($i=1;$i<count($measurements)-1;$i++){
            $date1=DateTime::createFromFormat('Y-m-d H:i:s', $measurements[$indexLastAccepted][$nbcolmum-1]);
            $date2=DateTime::createFromFormat('Y-m-d H:i:s', $measurements[$i][$nbcolmum-1]);
            $interval=$date2->diff($date1);
            $total = ($interval->format('%a') * 24 * 60 * 60) + ($interval->format('%h') * 60 * 60) + ($interval->format('%i') * 60) + $interval->format('%s');
            if ($args["interval"]<=$total){
                $f++;
                for ($y=0;$y<$nbcolmum-1;$y++){  
                    $notTakenMeasurements[$y]+=$measurements[$i][$y];
                    $notTakenMeasurements[$y]/=$nbNTM+1;
                    $measurementsWithInterval[$f][$y]=$notTakenMeasurements[$y];     
                    $notTakenMeasurements[$y]=0;
                    
                }
                $nbNTM=0;
                $measurementsWithInterval[$f][$nbcolmum-1]=$measurements[$i][$nbcolmum-1];
                $indexLastAccepted=$i;
            }else{
                for ($y=0;$y<$nbcolmum-1;$y++){
                    $notTakenMeasurements[$y]+=$measurements[$i][$y];
                              
                }
                $nbNTM++; 
            }    
        }
        $measurements=$measurementsWithInterval;
    }
    if (isset($args["volume"]) && $args["volume"]==True){
        for ($i=0;$i<count($measurements)-1;$i++){
            if (isset($measurements[$i]["CO2"])){
                var_dump($measurements[$i]["CO2"]);
                $measurements[$i]["CO2"]=$measurements[$i]["CO2"]*0.05;
            }
            if (isset($measurements[$i]["O2"])){
                $measurements[$i]["O2"]*=($info["volume"]/1000);
            }
        }
    }
    
    
    
    header('Content-Type: application/csv');
    header('Content-Disposition: attachment; filename="mesures.csv"');

    // open the "output" stream
    $f = fopen('php://output', 'w');

    // send the column headers
    $headers = [];
    foreach ($measurements[0] as $key => $value) {
        if (is_string($key)) {
            array_push($headers, $key);
        }
    }
    fputcsv($f, $headers, ";");

    // output each row of the data
    foreach ($measurements as $line) {
        // remove the duplicate keys
        foreach ($line as $key => $value) {
            if (is_string($key)) {
                unset($line[$key]);
            }
        }

        fputcsv($f, $line, ";");
    }

    fclose($f);
} else {
    replyError("Impossible d'exporter la campagne", "La méthode de requête est incorrecte.");
}

?>
    
