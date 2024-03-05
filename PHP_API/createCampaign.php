<?php 
header("Content-Type: application/json; charset=utf-8");

include_once __DIR__ . "/../include/database.php";
include_once __DIR__ . "/../include/reply.php";
include_once __DIR__ . "/../include/NodeRED_API.php";

const MEASUREMENTS_SIZE_PER_HOUR = 1497.6; // In KB
const MEASUREMENTS_SIZE_PER_LINE = 0.46; // In KB

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // handle POST request

    $data = file_get_contents("php://input");
	$arguments = json_decode($data, true);

    // Checking the new measurement campaign settings.
    if (!isset($arguments["title"]) || empty($arguments["title"])){
        replyError("Impossible d'ajouter la campagne", "Le nom de votre campagne n'a pas été renseigné. Veuillez donner un nom à votre campagne puis réessayer.");
    }

    if (!isset($arguments["CO2_enabled"], $arguments["O2_enabled"], $arguments["temperature_enabled"], $arguments["luminosity_enabled"], $arguments["humidity_enabled"])){
        replyError("Impossible d'ajouter la campagne", "Il manque un ou plusieurs capteurs dans la requête.");
    }

    if (!is_bool($arguments["CO2_enabled"]) || !is_bool($arguments["O2_enabled"]) || !is_bool($arguments["temperature_enabled"]) || !is_bool($arguments["luminosity_enabled"]) || !is_bool($arguments["humidity_enabled"])){
        replyError("Impossible d'ajouter la campagne", "Le format de la liste des capteurs séléctionnés est incorrecte.");
    }

    if ($arguments["CO2_enabled"] == false && $arguments["O2_enabled"] == false && $arguments["temperature_enabled"] == false && $arguments["luminosity_enabled"] == false && $arguments["humidity_enabled"] == false){
        replyError("Impossible d'ajouter la campagne", "Aucun capteur n'a été séléctionné. Veillez séléctionner au moins un capteur puis réessayer.");
    }

    $duration = null;
    if (!isset($arguments["duration"]) || empty($arguments["duration"])){
        replyError("Impossible d'ajouter la campagne", "La durée de la campagne n'a pas été renseigné. Veuillez entrer un nombre entier positif puis réessayer.");
    }
    $duration = filter_var($arguments["duration"], FILTER_VALIDATE_INT);
    if ($duration === false) {
        replyError("Impossible d'ajouter la campagne", "Le format de la durée de la campagne est incorrecte. Veuillez entrer un nombre entier positif puis réessayer.");
    }

    $interval = null;
    if (!isset($arguments["interval"]) || empty($arguments["interval"])){
        replyError("Impossible d'ajouter la campagne", "L'intervalle de relevé de la campagne n'a pas été renseigné ou son format est incorrecte. Veuillez entrer un nombre entier positif puis réessayer.");
    }
    $interval = filter_var($arguments["interval"], FILTER_VALIDATE_INT);
    if ($interval === false) {
        replyError("Impossible d'ajouter la campagne", "Le format de l'intervalle de relève de la campagne est incorrecte. Veuillez entrer un nombre entier positif puis réessayer.");
    }

    $volume = null;
    if (isset($arguments["volume"]) && !empty($arguments["volume"])) {
        $volume = filter_var($arguments["volume"], FILTER_VALIDATE_FLOAT);
        if ($volume === false) {
            replyError("Impossible d'ajouter la campagne", "Le format du volume de la campagne est incorrecte. Veuillez entrer un nombre décimal positif puis réessayer.");
        }
    }

    if (!isset($arguments["volume_unit"], $arguments["interval_unit"], $arguments["duration_unit"]) || !is_string($arguments["volume_unit"]) || !is_string($arguments["interval_unit"]) || !is_string($arguments["duration_unit"])) {
        replyError("Impossible d'ajouter la campagne", "Le format d'une unité séléctionné est incorrecte ou manquante.");
    }
    

    if ($volume != null) {
        switch ($arguments["volume_unit"]) {
            case "mL":
                break;
            case "cL":
                $volume *= 10;
                break;
            default:
                replyError("Impossible d'ajouter la campagne", "L'unité du volume séléctionné est incorrecte.");
                break;
        }
    }

    switch ($arguments["interval_unit"]) {
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
            replyError("Impossible d'ajouter la campagne", "L'unité de l'intervalle séléctionné est incorrecte.");
            break;
    }

    switch ($arguments["duration_unit"]) {
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
            replyError("Impossible d'ajouter la campagne", "L'unité de la durée séléctionné est incorrecte.");
            break;
    }

    if ($interval > $duration) {
        replyError("Impossible d'ajouter la campagne", "L'intervalle demandé doit être inférieur ou égale à la durée de la campagne.");
    }

    $config_id = null;
    if (!isset($arguments["config_id"])){
        replyError("Impossible d'ajouter la campagne", "L'identifiant de configuration n'a pas été renseigné. Veuillez entrer un nombre entier positif puis réessayer.");
    }
    if (empty($arguments["config_id"])){
        replyError("Impossible d'ajouter la campagne", "Aucune configuration n'a été séléctionné. Veuillez séléctionner une configuration puis réessayer.");
    }
    $config_id = filter_var($arguments["config_id"], FILTER_VALIDATE_INT);
    if ($config_id === false) {
        replyError("Impossible d'ajouter la campagne", "Le format de l'identifiant de configuration de la campagne est incorrecte. Veuillez entrer un nombre entier positif puis réessayer.");
    }

    if (!isset($arguments["humid_mode"])){
        replyError("Impossible d'ajouter la campagne", "Le mode de mesure est manquant. Veuillez réessayer.");
        if (!is_bool($arguments["humid_mode"])){
            replyError("Impossible d'ajouter la campagne", "Le format du mode de mesure est incorrecte.");
        }
    }

    if (!isset($arguments["enable_fibox_temp"])){
        replyError("Impossible d'ajouter la campagne", "Le mode d'activation du capteur de température du Fibox est manquant. Veuillez réessayer.");
        if (!is_bool($arguments["enable_fibox_temp"])){
            replyError("Impossible d'ajouter la campagne", "Le format du mode d'activation du capteur de température du Fibox est incorrecte.");
        }
    }
    
    
    // Check if a campaign is already running
    $data = NodeRedGet("check_working_campaign");

    if (!array_key_exists("idCurrent", $data)) {
        replyError("Impossible d'ajouter la campagne", "Une erreur est survenue lors de la vérification de l'état de la campagne en cours d'exécution. Veuillez réessayer.");
    }
    if ($data["idCurrent"] != null) {
        replyError("Impossible d'ajouter la campagne", "Une campagne est déjà en cours d'exécution. Veuillez attendre la fin de celle-ci ou arrêtez la puis réessayer.");
    }


    // check if there is enough space on the device
    $storage=NodeRedGet("storage");

    $lines = $duration / $interval;
    $size = $lines * MEASUREMENTS_SIZE_PER_LINE;

    if (!isset($storage["used"]) || !isset($storage["total"])) {
        replyError("Impossible d'ajouter la campagne", "Les caractéristiques actuelles de la mémoire de l'appareil n'ont pas été récupéré");
    }
    if (!is_int($storage["used"]) || !is_int($storage["total"])) {
        replyError("Impossible d'ajouter la campagne", "Le format des caractéristiques actuelles de la mémoire de l'appareil est incorrect");
    }
    
    if ($size + $storage["used"] >= $storage["total"]){
        replyError("Impossible d'ajouter la campagne", "La place que prendra la campagne dépasse l'espace mémoire restant. Veuillez changer la durée, l'intervalle de la campagne et/ou supprimer d'anciennes campagnes");
    }


    // Creation of the new measurement campaign.
    $id = addCampaign($config_id, $arguments["title"], $arguments["temperature_enabled"], $arguments["CO2_enabled"], $arguments["O2_enabled"], $arguments["luminosity_enabled"], $arguments["humidity_enabled"], $interval, $volume, $duration, $arguments["humid_mode"], $arguments["enable_fibox_temp"]);

    NodeRedPost("createCampaign",array('id' => $id,'key' => 'I_do_believe_I_am_on_fire'));

    reply(array(
        "id" => $id
    ));
} else {
    replyError("Impossible d'ajouter la campagne", "La méthode de requête est incorrecte.");
}
