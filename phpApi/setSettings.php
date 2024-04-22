<?php

/**
 * @file
 * Save the measurement device settings in the database and apply network settings with Node.JS API.
 *
 * @URL /phpApi/setSettings.php
 * @METHOD POST
 * @CONTENT-TYPE application/json
 * @BODY { "timeConservation": number, "timeConservationUnit": string, "enableAutoRemove": boolean, "ssid": string, "password": string }
 *      - timeConservation : The time interval for deleting campaigns.
 *      - timeConservationUnit : The unit of the time interval for deleting campaigns.
 *      - enableAutoRemove : The state of automatic deletion.
 *      - ssid : The name of the Wi-Fi network.
 *      - password : The password of the Wi-Fi network.
 * @RETURNS { "success": true } with 200 error code if the settings have been saved successfully.
 */

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
            throw new Exception("L'intervalle de suppression des campagnes n'a pas été renseigné. Veuillez le renseigner.");
        }
        if ($arguments["timeConservation"] == 0){
            throw new Exception("L'intervalle de suppression des campagnes ne peux être égale à 0. Veuillez le modifier.");
        }
        if (!isset($arguments["timeConservationUnit"]) || !is_string($arguments["timeConservationUnit"])){
            throw new Exception("L'unité de l'intervalle de suppression des campagnes n'a pas été renseigné ou son format est incorrect. Veuillez la renseigner.");
        }
        if (!isset($arguments["enableAutoRemove"]) || !is_bool($arguments["enableAutoRemove"])){
            throw new Exception("L'état d'activation de la suppression automatique n'a pas été renseigné ou son format est incorrect. Veuillez le renseigner.");
        }
        if (isset($arguments["ssid"]) && (!is_string($arguments["ssid"]) || $arguments["ssid"] == null)){
            throw new Exception("Le nom du réseau Wi-Fi n'a pas été renseigné ou son format est incorrect. Veuillez le renseigner.");
        }
        if (isset($arguments["password"]) && (!is_string($arguments["password"]) || $arguments["password"] == null)){
            throw new Exception("Le mot de passe du réseau Wi-Fi n'a pas été renseigné ou son format est incorrect. Veuillez le renseigner.");
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
        }

        $networkData = nodeJsGet("getAccessPoint")["data"];
        $setAccessPointArgs = array();
        if (isset($arguments["ssid"]) && $arguments["ssid"] != $networkData["ssid"]) {
            if(strlen($arguments["ssid"]) > 32 || strlen($arguments["ssid"]) < 2){
                throw new Exception("Le nouveau nom du réseau doit contenir entre 2 et 32 caractères.");
            }
            if(!preg_match('/^[a-zA-Z0-9\s\-_]+$/', $arguments["ssid"])){
                throw new Exception("Des caractères spéciaux et interdits sont utilisés pour le nouveau nom du réseau. Veuillez renseigner un nom de réseau conforme (caractères autorisés : a à z, A à Z, 0 à 9, -, _ et espaces).");
            }
            $setAccessPointArgs["ssid"] = $arguments["ssid"];
        }
        if (isset($arguments["password"]) && $arguments["password"] != $networkData["password"]) {
            if(strlen($arguments["password"]) > 63 || strlen($arguments["password"]) < 8){
                throw new Exception("Le mot de passe du réseau doit contenir entre 8 et 63 caractères.");
            }
            if(!preg_match('/^[a-zA-Z0-9\s\-_]+$/', $arguments["password"])){
                throw new Exception("Des caractères spéciaux et interdits sont utilisés pour le nouveau mot de passe du réseau. Veuillez renseigner un mot de passe conforme (caractères autorisés : a à z, A à Z, 0 à 9, -, _ et espaces).");
            }
            $setAccessPointArgs["password"] = $arguments["password"];
        }


        if (!empty($setAccessPointArgs)) {
            nodeJsPost("setAccessPoint", $setAccessPointArgs);
        }

        $settingsManager->setSettings($interval, $arguments["enableAutoRemove"]);

        $reply->replySuccess();
    } else {
        throw new Exception("La méthode de requête est incorrecte.");
    }
} catch (\Throwable $th) {
    $reply->replyError($errorTitle, $th);
}
