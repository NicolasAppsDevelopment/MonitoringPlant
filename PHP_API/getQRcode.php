<?php 
require_once __DIR__ . "/../vendor/autoload.php";
use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;

// get ssid and password of the Raspberry Pi
$ssid = "Cellule de mesure";
$password = "feur1234";
$wifi = "WIFI:T:WPA;S:" . $ssid . ";P:" . $password . ";;";

$qrCode = QrCode::create($wifi);

$writer = new PngWriter();
$result = $writer->write($qrCode);

header('Content-Type: '.$result->getMimeType());
echo $result->getString();