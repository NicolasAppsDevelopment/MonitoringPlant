<?php
include_once __DIR__ . "/../include/NodeJsApi.php";

include_once '../include/CampaignsManager.php';
include_once '../include/RequestReplySender.php';

$reply = RequestReplySender::getInstance();
$errorTitle = "Impossible d'ajouter la campagne";

const MEASUREMENTS_SIZE_PER_HOUR = 1497.6; // In KB
const MEASUREMENTS_SIZE_PER_LINE = 0.46; // In KB

try {
    $campaignsManager = CampaignsManager::getInstance();

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // handle POST request

        $data = file_get_contents("php://input");
        $arguments = json_decode($data, true);


        // Checking the new measurement campaign settings.
        if (!isset($arguments["title"]) || empty($arguments["title"])){
            throw new Exception("Le nom de votre campagne n'a pas été renseigné. Veuillez donner un nom à votre campagne puis réessayer.");
        }


        if (!isset($arguments["co2Enabled"], $arguments["o2Enabled"], $arguments["temperatureEnabled"], $arguments["luminosityEnabled"], $arguments["humidityEnabled"])){
            throw new Exception("Il manque un ou plusieurs capteurs dans la requête.");
        }

        if (!is_bool($arguments["co2Enabled"]) || !is_bool($arguments["o2Enabled"]) || !is_bool($arguments["temperatureEnabled"]) || !is_bool($arguments["luminosityEnabled"]) || !is_bool($arguments["humidityEnabled"])){
            throw new Exception("Le format de la liste des capteurs séléctionnés est incorrecte.");
        }

        if ($arguments["co2Enabled"] == false && $arguments["o2Enabled"] == false && $arguments["temperatureEnabled"] == false && $arguments["luminosityEnabled"] == false && $arguments["humidityEnabled"] == false){
            throw new Exception("Aucun capteur n'a été séléctionné. Veillez séléctionner au moins un capteur puis réessayer.");
        }

        $duration = null;
        if (!isset($arguments["duration"]) || empty($arguments["duration"])){
            throw new Exception("La durée de la campagne n'a pas été renseigné. Veuillez entrer un nombre entier positif puis réessayer.");
        }
        $duration = filter_var($arguments["duration"], FILTER_VALIDATE_INT);
        if ($duration === false) {
            throw new Exception("Le format de la durée de la campagne est incorrecte. Veuillez entrer un nombre entier positif puis réessayer.");
        }

        $interval = null;
        if (!isset($arguments["interval"]) || empty($arguments["interval"])){
            throw new Exception("L'intervalle de relevé de la campagne n'a pas été renseigné ou son format est incorrecte. Veuillez entrer un nombre entier positif puis réessayer.");
        }
        $interval = filter_var($arguments["interval"], FILTER_VALIDATE_INT);
        if ($interval === false) {
            throw new Exception("Le format de l'intervalle de relève de la campagne est incorrecte. Veuillez entrer un nombre entier positif puis réessayer.");
        }

        $volume = null;
        if (isset($arguments["volume"]) && !empty($arguments["volume"])) {
            $volume = filter_var($arguments["volume"], FILTER_VALIDATE_FLOAT);
            if ($volume === false) {
                throw new Exception("Le format du volume de la campagne est incorrecte. Veuillez entrer un nombre décimal positif puis réessayer.");
            }
        }

        if (!isset($arguments["volumeUnit"], $arguments["intervalUnit"], $arguments["durationUnit"]) || !is_string($arguments["volumeUnit"]) || !is_string($arguments["intervalUnit"]) || !is_string($arguments["durationUnit"])) {
            throw new Exception("Le format d'une unité séléctionné est incorrecte ou manquante.");
        }
        

        if ($volume != null) {
            switch ($arguments["volumeUnit"]) {
                case "mL":
                    break;
                case "cL":
                    $volume *= 10;
                    break;
                default:
                    throw new Exception("L'unité du volume séléctionné est incorrecte.");
                    break;
            }
        }

        switch ($arguments["intervalUnit"]) {
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


        switch ($arguments["durationUnit"]) {
            case "s":
                break;
            case "min":
                $duration *= 60;
                break;
            case "h":
                $duration *= 3600;
                break;
            case "j":
                $duration *= 86400;
                break;
            default:
                throw new Exception("L'unité de la durée séléctionné est incorrecte.");
                break;
        }

        if ($interval > $duration) {
            throw new Exception("L'intervalle demandé doit être inférieur ou égale à la durée de la campagne.");
        }

        $configId = null;
        if (!isset($arguments["configId"])){
            throw new Exception("L'identifiant de configuration n'a pas été renseigné. Veuillez entrer un nombre entier positif puis réessayer.");
        }
        if (empty($arguments["configId"])){
            throw new Exception("Aucune configuration n'a été séléctionné. Veuillez séléctionner une configuration puis réessayer.");
        }
        $configId = filter_var($arguments["configId"], FILTER_VALIDATE_INT);
        if ($configId === false) {
            throw new Exception("Le format de l'identifiant de configuration de la campagne est incorrecte. Veuillez entrer un nombre entier positif puis réessayer.");
        }

        if (!isset($arguments["humidMode"])){
            throw new Exception("Le mode de mesure est manquant. Veuillez réessayer.");
        }
        if (!is_bool($arguments["humidMode"])){
            throw new Exception("Le format du mode de mesure est incorrecte.");
        }

        if (!isset($arguments["enableFiboxTemp"])){
            throw new Exception("Le mode d'activation du capteur de température du Fibox est manquant. Veuillez réessayer.");
        }
        if (!is_bool($arguments["enableFiboxTemp"])){
            throw new Exception("Le format du mode d'activation du capteur de température du Fibox est incorrecte.");
        }
        
        
        // Check if a campaign is already running
        $data = NodeJsGet("check_working_campaign");

        if (!array_key_exists("idCurrent", $data)) {
            throw new Exception("Une erreur est survenue lors de la vérification de l'état de la campagne en cours d'exécution. Veuillez réessayer.");
        }
        if ($data["idCurrent"] != null) {
            throw new Exception("Une campagne est déjà en cours d'exécution. Veuillez attendre la fin de celle-ci ou arrêtez la puis réessayer.");
        }

        // check if there is enough space on the device
        $storage=NodeJsGet("storage");

        $lines = $duration / $interval;
        $size = $lines * MEASUREMENTS_SIZE_PER_LINE;

        if (!isset($storage["used"]) || !isset($storage["total"])) {
            throw new Exception("Les caractéristiques actuelles de la mémoire de l'appareil n'ont pas été récupéré");
        }
        if (!is_int($storage["used"]) || !is_int($storage["total"])) {
            throw new Exception("Le format des caractéristiques actuelles de la mémoire de l'appareil est incorrect");
        }
        
        if ($size + $storage["used"] >= $storage["total"]){
            throw new Exception("La place que prendra la campagne dépasse l'espace mémoire restant. Veuillez changer la durée, l'intervalle de la campagne et/ou supprimer d'anciennes campagnes");
        }


        // Creation of the new measurement campaign.
        $id = $campaignsManager->addCampaign($configId, $arguments["title"], $arguments["temperatureEnabled"], $arguments["co2Enabled"], $arguments["o2Enabled"], $arguments["luminosityEnabled"], $arguments["humidityEnabled"], $interval, $volume, $duration, $arguments["humidMode"], $arguments["enableFiboxTemp"]);

        NodeJsPost("createCampaign", array('id' => $id, 'key' => 'I_do_believe_I_am_on_fire'));

        $reply->replyData([
            "id" => $id
        ]);
    } else {
        throw new Exception("La méthode de requête est incorrecte.");
    }
} catch (\Throwable $th) {
    $reply->replyError($errorTitle, $th);
}
