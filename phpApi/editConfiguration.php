<?php

include_once '../include/Session.php';
include_once '../include/ConfigurationsManager.php';
include_once '../include/RequestReplySender.php';

$configManager = ConfigurationsManager::getInstance();
$reply = RequestReplySender::getInstance();
$session = Session::getInstance();
$errorTitle = "Impossible de modifier la configuration";

try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // handle POST request

        $data = file_get_contents("php://input");
        $arguments = json_decode($data, true);

        if (!$session->isAdmin()){
            throw new Exception("Cette action nécessite d'abord d'être identifié en tant qu'administrateur.");
        }

        if (!isset($arguments["id"])){
            throw new Exception("L'identifiant de la configuration n'a pas été renseigné. Veuillez rafraîchir la page puis réessayer.");
        }
        $id = filter_var($arguments["id"], FILTER_VALIDATE_INT);
        if ($id === false) {
            throw new Exception("Le format de l'identifiaant de la configuration est incorrecte. Veuillez rafraîchir la page puis réessayer.");
        }

        if (!isset($arguments["name"]) || $arguments["name"] === ""){
            throw new Exception("Le nom de votre configuration n'a pas été renseigné. Veuillez donner un nom à votre configuration puis réessayer.");
        }

        // get float constants from request
        // f1, m, dPhi1, dPhi2, dKSV1, dKSV2
        $f1 = null;
        if (isset($arguments["f1"]) && $arguments["f1"] !== "") {
            $f1 = filter_var($arguments["f1"], FILTER_VALIDATE_FLOAT);
            if ($f1 === false) {
                throw new Exception("Le format de la constante f1 est incorrecte. Veuillez entrer un nombre positif puis réessayer.");
            }
        }

        $m = null;
        if (isset($arguments["m"]) && $arguments["m"] !== "") {
            $m = filter_var($arguments["m"], FILTER_VALIDATE_FLOAT);
            if ($m === false) {
                throw new Exception("Le format de la constante m est incorrecte. Veuillez entrer un nombre positif puis réessayer.");
            }
        }

        $dPhi1 = null;
        if (isset($arguments["dPhi1"]) && $arguments["dPhi1"] !== "") {
            $dPhi1 = filter_var($arguments["dPhi1"], FILTER_VALIDATE_FLOAT);
            if ($dPhi1 === false) {
                throw new Exception("Le format de la constante dPhi1 est incorrecte. Veuillez entrer un nombre positif puis réessayer.");
            }
        }

        $dPhi2 = null;
        if (isset($arguments["dPhi2"]) && $arguments["dPhi2"] !== "") {
            $dPhi2 = filter_var($arguments["dPhi2"], FILTER_VALIDATE_FLOAT);
            if ($dPhi2 === false) {
                throw new Exception("Le format de la constante dPhi2 est incorrecte. Veuillez entrer un nombre positif puis réessayer.");
            }
        }

        $dKSV1 = null;
        if (isset($arguments["dKSV1"]) && $arguments["dKSV1"] !== "") {
            $dKSV1 = filter_var($arguments["dKSV1"], FILTER_VALIDATE_FLOAT);
            if ($dKSV1 === false) {
                throw new Exception("Le format de la constante dKSV1 est incorrecte. Veuillez entrer un nombre positif puis réessayer.");
            }
        }

        $dKSV2 = null;
        if (isset($arguments["dKSV2"]) && $arguments["dKSV2"] !== "") {
            $dKSV2 = filter_var($arguments["dKSV2"], FILTER_VALIDATE_FLOAT);
            if ($dKSV2 === false) {
                throw new Exception("Le format de la constante dKSV2 est incorrecte. Veuillez entrer un nombre positif puis réessayer.");
            }
        }

        // get float calib constants from request
        // cal0, cal2nd, t0, t2nd

        $cal0 = null;
        if (isset($arguments["cal0"]) && $arguments["cal0"] !== "") {
            $cal0 = filter_var($arguments["cal0"], FILTER_VALIDATE_FLOAT);
            if ($cal0 === false) {
                throw new Exception("Le format de la constante cal0 est incorrecte. Veuillez entrer un nombre positif puis réessayer.");
            }
        }

        $cal2nd = null;
        if (isset($arguments["cal2nd"]) && $arguments["cal2nd"] !== "") {
            $cal2nd = filter_var($arguments["cal2nd"], FILTER_VALIDATE_FLOAT);
            if ($cal2nd === false) {
                throw new Exception("Le format de la constante cal2nd est incorrecte. Veuillez entrer un nombre positif puis réessayer.");
            }
        }

        $t0 = null;
        if (isset($arguments["t0"]) && $arguments["t0"] !== "") {
            $t0 = filter_var($arguments["t0"], FILTER_VALIDATE_FLOAT);
            if ($t0 === false) {
                throw new Exception("Le format de la constante t0 est incorrecte. Veuillez entrer un nombre positif puis réessayer.");
            }
        }

        $t2nd = null;
        if (isset($arguments["t2nd"]) && $arguments["t2nd"] !== "") {
            $t2nd = filter_var($arguments["t2nd"], FILTER_VALIDATE_FLOAT);
            if ($t2nd === false) {
                throw new Exception("Le format de la constante t2nd est incorrecte. Veuillez entrer un nombre positif puis réessayer.");
            }
        }

        // get int calib constants from request
        // pressure, o2cal2nd, altitude

        $pressure = null;
        if (isset($arguments["pressure"]) && $arguments["pressure"] !== "") {
            $pressure = filter_var($arguments["pressure"], FILTER_VALIDATE_INT);
            if ($pressure === false) {
                throw new Exception("Le format de la constante pressure est incorrecte. Veuillez entrer un nombre entier positif puis réessayer.");
            }
        }

        $o2cal2nd = null;
        if (isset($arguments["o2cal2nd"]) && $arguments["o2cal2nd"] !== "") {
            $o2cal2nd = filter_var($arguments["o2cal2nd"], FILTER_VALIDATE_INT);
            if ($o2cal2nd === false) {
                throw new Exception("Le format de la constante o2cal2nd est incorrecte. Veuillez entrer un nombre entier positif puis réessayer.");
            }
        }

        $altitude = null;
        if (isset($arguments["altitude"]) && $arguments["altitude"] !== "") {
            $altitude = filter_var($arguments["altitude"], FILTER_VALIDATE_INT);
            if ($altitude === false) {
                throw new Exception("Le format de l'altitude est incorrecte. Veuillez entrer un nombre entier positif puis réessayer.");
            }
        }

        // get bool from request
        // calib_is_humid

        if (!isset($arguments["calib_is_humid"])){
            throw new Exception("Le mode de calibration est manquant. Veuillez réessayer.");
        }
        if (!is_bool($arguments["calib_is_humid"])){
            throw new Exception("Le format du mode de calibration est incorrecte.");
        }

        $configManager->editConfiguration($id, $arguments["name"], $f1, $m, $dPhi1, $dPhi2, $dKSV1, $dKSV2, $cal0, $cal2nd, $t0, $t2nd, $pressure, $o2cal2nd, $altitude, $arguments["calib_is_humid"]);

        $reply->replySuccess();
    } else {
        throw new Exception("La méthode de requête est incorrecte.");
    }
} catch (\Throwable $th) {
    $reply->replyError($errorTitle, $th);
}
