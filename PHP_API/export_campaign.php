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

    $measurements=exportCampaign($args["id"], $args["temperature_enabled"], $args["CO2_enabled"], $args["O2_enabled"], $args["luminosity_enabled"], $args["humidity_enabled"], $start, $end);
    $nbcolmum=1+(int)$args["temperature_enabled"]+(int)$args["CO2_enabled"]+(int)$args["O2_enabled"]+(int)$args["luminosity_enabled"]+(int)$args["humidity_enabled"];
    $f=0;
    $indexLastAccepted=0;
    if(isset($args["interval"]) && isset($args["averaging"]) && $args["averaging"]==false){
        $measurementsWithInterval[$f]=$measurements[0];
        for ($i=1;$i<count($measurements)-1;$i++){
            if ($args["interval"]<=$measurements[$i][$nbcolmum-1]-$measurements[$indexLastAccepted][$nbcolmum-1]){
                $measurementsWithInterval[$f]=$measurements[$i];
                $f++;
                $indexLastAccepted=$i;
            }     
        }
        $measurements=$measurementsWithInterval;
    }
    if(isset($args["interval"]) && isset($args["averaging"]) && $args["averaging"]==true){
        $notTakenMeasurements=array();
        $measurementsWithInterval[$f]=$measurements[0];
        for ($i=1;$i<count($measurements)-1;$i++){
            if ($args["interval"]<=$measurements[$i][$nbcolmum-1]-$measurements[$indexLastAccepted][$nbcolmum-1]){
                for ($y=0;$y<$nbcolmum-2;$y++){  
                    $stnotTakenMeasurementsack[$y]+=$measurements[$i][$y];
                    $stnotTakenMeasurementsack[$y]/=2;
                    $measurementsWithInterval[$f][$y]=$stnotTakenMeasurementsack[$y];
                }
                $measurementsWithInterval[$f][$nbcolmum-1]=$measurements[$i][$nbcolmum-1];
                $f++;
                $indexLastAccepted=$i;
            }else{
                for ($y=0;$y<$nbcolmum-2;$y++){
                    $stnotTakenMeasurementsack[$y]+=$measurements[$i][$y];
                    $stnotTakenMeasurementsack[$y]/=2;
                }
            }    
        }
        $measurements=$measurementsWithInterval;
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
            if (is_int($key)) {
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
    
