<?php
include_once '../include/NodeJsApi.php';
include_once '../include/Session.php';
include_once '../include/SettingsManager.php';
include_once '../include/RequestReplySender.php';

$reply = RequestReplySender::getInstance();
$errorTitle = "Impossible de sauvegarder les paramètres";

try {
    $settingsManager = SettingsManager::getInstance();
    $session = Session::getInstance();

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // handle POST request

        $data = file_get_contents("php://input");
        $arguments = json_decode($data, true);

        if (!isset($arguments["timeConservation"])){
            throw new Exception("L'intervalle de suppression des campagnes n'a pas été renseigné. Veuillez la renseigner.");
        }
        if (!isset($arguments["timeConservationUnit"]) || !is_string($arguments["timeConservationUnit"])){
            throw new Exception("L'unité de l'intervalle de suppression des campagnes n'a pas été renseigné ou son format est incorrect. Veuillez la renseigner.");
        }
        if (!isset($arguments["enableAutoRemove"]) || !is_bool($arguments["enableAutoRemove"])){
            throw new Exception("L'état d'activation de la suppression automatique n'a pas été renseigné ou son format est incorrect. Veuillez le renseigner.");
        }
        if (!isset($arguments["network"]) || !is_string($arguments["network"])){
            throw new Exception("Le nom du réseau WIFI n'a pas été renseigné ou son format est incorrect. Veuillez le renseigner.");
        }

        $interval = filter_var($arguments["timeConservation"], FILTER_VALIDATE_INT);
        if ($interval === false) {
            throw new Exception("Le format de l'intervalle de suppression des campagnes est incorrecte. Veuillez entrer un nombre entier positif puis réessayer.");
        }

        switch ($arguments["timeConservationUnit"]) {
            case "h":
                $interval *= 3600;
                break;
            case "j":
                $interval *= 86400;
                break;
            case "mois":
                $interval *= 2592000;
                break;
            default:
                throw new Exception("L'unité de l'intervalle séléctionné est incorrecte.");
                break;
        }

        $networkData = NodeJsGet("getAccessPoint")["data"];
        $setAccessPointArgs = array();
        if ($arguments["ssid"]!=null) {
            if(strlen($arguments["ssid"]) > 32 && strlen($arguments["ssid"]) == 0){
                throw new Exception("Le nouveau nom du réseau dépasse 32 caractères ou ne contient aucun caractère. Veuillez renseigner un nom de réseau entre 1 et 32 caractères.");
            }
            if(!preg_match('/^[a-zA-Z0-9\s\-_]+$/', $arguments["ssid"])){
                throw new Exception("Des caractères spéciaux et interdits sont utilisés pour le nouveau nom du réseau. Veuillez renseigner un nom de réseau sans caractère spéciaux puis réessayez.");
            }
            if ($arguments["ssid"]!=$networkData["ssid"]) {
                $setAccessPointArgs["ssid"] = $arguments["ssid"];
            }
        }
        if ($arguments["password"]!=null && $arguments["password"]!=$networkData["password"]) {
            if(strlen($arguments["ssid"]) < 8){
                throw new Exception("Le mot de passe du réseau doit contenir au moins 8 caractères. Veuillez renseigner un mot de passe de 8 caractères ou plus puis réessayez.");
            }
            $setAccessPointArgs["password"] = $arguments["password"];
        }
        if (count($setAccessPointArgs) > 0) {
            NodeJsPost("setAccessPoint", $setAccessPointArgs);
        }

        $settingsManager->setSettings($interval, $arguments["enableAutoRemove"]);

        $reply->replySuccess();
    } else {
        throw new Exception("La méthode de requête est incorrecte.");
    }
} catch (\Throwable $th) {
    $reply->replyError($errorTitle, $th);
}
