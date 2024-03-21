<?php

include_once '../include/CampaignsManager.php';
include_once '../include/RequestReplySender.php';

$campaignsManager = CampaignsManager::getInstance();
$reply = RequestReplySender::getInstance();
$errorTitle = "Impossible d'exporter la campagne";


function getIndexFromKeyName(array $arr, string $keyName) : int {
    // remove the duplicate keys
    foreach ($arr as $key => $value) {
        if (is_int($key)) {
            unset($arr[$key]);
        }
    }

    // find index in string keys
    $i = 0;
    foreach ($arr as $key => $value) {
        if ($key == $keyName) {
            return $i;
        }
        $i++;
    }

    return null;
}

try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // handle POST request

        $data = file_get_contents("php://input");
        $args = json_decode($data, true);

        if (!isset($args["id"])){
            throw new Exception("L'identifiant de la campagne n'a pas été renseigné. Veuillez rafraîchir la page puis réessayer.");
        }
        $id = filter_var($args["id"], FILTER_VALIDATE_INT);
        if ($id === false) {
            throw new Exception("Le format de l'identifiant de la campagne est incorrecte. Veuillez rafraîchir la page puis réessayer.");
        }

        // Checking export settings.
        if (!isset($args["co2Enabled"], $args["o2Enabled"], $args["temperatureEnabled"], $args["luminosityEnabled"], $args["humidityEnabled"])){
            throw new Exception("Il manque un ou plusieurs capteurs dans la requête.");
        }

        if (!is_bool($args["co2Enabled"]) || !is_bool($args["o2Enabled"]) || !is_bool($args["temperatureEnabled"]) || !is_bool($args["luminosityEnabled"]) || !is_bool($args["humidityEnabled"])){
            throw new Exception("Le format de la liste des capteurs séléctionnés est incorrecte.");
        }

        if ($args["co2Enabled"] == false && $args["o2Enabled"] == false && $args["temperatureEnabled"] == false && $args["luminosityEnabled"] == false && $args["humidityEnabled"] == false){
            throw new Exception("Aucun capteur n'a été séléctionné. Veillez séléctionner au moins un capteur puis réessayer.");
        }

        if (isset($args["intervalUnit"]) && !is_string($args["intervalUnit"])){
            throw new Exception("Le format de l'unité de l'interval de récupération des mesures de la campagne est incorrecte. Veuillez réessayer.");
        }

        $interval = null;
        if (isset($args["interval"]) && !empty($args["interval"])) {
            $interval = filter_var($args["interval"], FILTER_VALIDATE_INT);
            if ($interval === false) {
                throw new Exception("Le format de l'intervalle de récupération de la campagne est incorrecte. Veuillez entrer un nombre entier positif puis réessayer.");
            }


            switch ($args["intervalUnit"]) {
                case "s":
                    break;
                case "min":
                    $interval *= 60;
                    break;
                case "h":
                    $interval *= 3600;
                    break;
                case "j":
                    $interval *= 86400;
                    break;
                default:
                    throw new Exception("L'unité de l'intervalle séléctionné est incorrecte.");
                    break;
            }
        }

        if (isset($args["averaging"]) && !is_bool($args["averaging"])){
            throw new Exception("Le format du bouton 'moyennage' est incorrecte.");
        }

        if ($args["averaging"]==true && !isset($interval)){
            throw new Exception("Vous avez demandé la moyennage des valeurs sans définir un interval");
        }

        if (isset($args["startDate"]) && !is_string($args["startDate"])){
            throw new Exception("Le format de la date de début de récupération des mesures de la campagne est incorrecte. Veuillez réessayer.");
        }

        if (isset($args["endDate"]) && !is_string($args["endDate"])){
            throw new Exception("Le format de la date de fin de récupération des mesures de la campagne est incorrecte. Veuillez réessayer.");
        }

        if (isset($args["startTime"]) && !is_string($args["startTime"])){
            throw new Exception("Le format de l'heure de début de récupération des mesures de la campagne est incorrecte. Veuillez réessayer.");
        }

        if (isset($args["endTime"]) && !is_string($args["endTime"])){
            throw new Exception("Le format de l'heure de fin de récupération des mesures de la campagne est incorrecte. Veuillez réessayer.");
        }

        if ((!isset($args["startTime"]) || $args["startTime"] == "") && isset($args["startDate"])){
            $args["startTime"] = "00:00:00";
        }

        if ((!isset($args["endTime"]) || $args["endTime"] == "") && isset($args["endDate"])){
            $args["endTime"] = "23:59:59";
        }

        $start = "";
        if (isset($args["startTime"]) && isset($args["startDate"]) && $args["startDate"] != "" && $args["startTime"] != ""){
            $start = $args["startDate"] . " " . $args["startTime"];
        }

        $end = "";
        if (isset($args["endTime"]) && isset($args["endDate"]) && $args["endDate"] != "" && $args["endTime"] != ""){
            $end = $args["endDate"] . " " . $args["endTime"];
        }

        if (isset($args["volume"]) && !is_bool($args["volume"]) ){
            throw new Exception("Le format du bouton 'volume' est incorrecte.");
        }

    
        $measurements = $campaignsManager->exportCampaign($id, $args["temperatureEnabled"], $args["co2Enabled"], $args["o2Enabled"], $args["luminosityEnabled"], $args["humidityEnabled"], $start, $end);
        if (count($measurements) == 0){
            throw new Exception("Aucune mesure ne correspond aux critères que vous avez demandé.");
        }
        
        $info = $campaignsManager->getInfoCampaign($id);
        if ($args["volume"]==True && is_null($info["volume"])){
            throw new Exception("Aucun volume n'a été renseigné lors du démarrage de la campagne");
        }

        $nbcolmum = $nbcolmum = (int)(count($measurements[0]) / 2);
        $indexC02=null;
        $index02=null;
        if ($args["co2Enabled"] == true){
            $indexC02=getIndexFromKeyName($measurements[0], "CO2");
        }
        if ($args["o2Enabled"] == true){
            $index02=getIndexFromKeyName($measurements[0], "O2");
        }

        if (isset($args["volume"]) && $args["volume"]==true){
            for ($i=0;$i<count($measurements)-1;$i++){
                if (isset($measurements[$i]["CO2"])){
                    $measurements[$i][$indexC02]*=($info["volume"]/1000);
                }
                if (isset($measurements[$i]["O2"])){
                    $measurements[$i][$index02]*=($info["volume"]/1000);
                }
            }
        }


        
        $f=0;
        $indexLastAccepted=0;
        if(isset($interval) && isset($args["averaging"]) && $args["averaging"]==false){
            $measurementsWithInterval[$f]=$measurements[0];
            for ($i=1;$i<count($measurements)-1;$i++){
                $date1=DateTime::createFromFormat('Y-m-d H:i:s', $measurements[$indexLastAccepted][$nbcolmum-1]);
                $date2=DateTime::createFromFormat('Y-m-d H:i:s', $measurements[$i][$nbcolmum-1]);
                $interval_=$date2->diff($date1);
                $total = ($interval_->format('%a') * 24 * 60 * 60) + ($interval_->format('%h') * 60 * 60) + ($interval_->format('%i') * 60) + $interval_->format('%s');
                if ($interval<=$total){
                    $f++;
                    $measurementsWithInterval[$f]=$measurements[$i];
                    $indexLastAccepted=$i;
                }
            }
            $measurements=$measurementsWithInterval;
        }

        if(isset($interval) && isset($args["averaging"]) && $args["averaging"]==true){
            $notTakenMeasurements=[];
            for ($i=0; $i <$nbcolmum-1 ; $i++) {
                array_push($notTakenMeasurements, 0);
            }
            $nbNTM=0;
            $measurementsWithInterval[$f]=$measurements[0];
            for ($i=1;$i<count($measurements)-1;$i++){
                $date1=DateTime::createFromFormat('Y-m-d H:i:s', $measurements[$indexLastAccepted][$nbcolmum-1]);
                $date2=DateTime::createFromFormat('Y-m-d H:i:s', $measurements[$i][$nbcolmum-1]);
                $interval_=$date2->diff($date1);
                $total = ($interval_->format('%a') * 24 * 60 * 60) + ($interval_->format('%h') * 60 * 60) + ($interval_->format('%i') * 60) + $interval_->format('%s');
                if ($interval<=$total){
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
        throw new Exception("La méthode de requête est incorrecte.");
    }
} catch (\Throwable $th) {
    $reply->replyError($errorTitle, $th);
}
