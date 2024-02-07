<?php
//Node-RED access configuration
global $NODE_RED_API_IP, $NODE_RED_API_PORT, $NODE_RED_API_URL;
$NODE_RED_API_IP = "192.168.4.1";
$NODE_RED_API_PORT = "1880";
$NODE_RED_API_URL = "http://$NODE_RED_API_IP:$NODE_RED_API_PORT";


function NodeRedPost(string $name, array $array)
{
    $NodeRedUrl = 'http://192.168.4.1:1880';

    $requestUrl = $NodeRedUrl . "/" . $name;
    $curl = curl_init($requestUrl);
    curl_setopt($curl, CURLOPT_POST, true);
    curl_setopt($curl, CURLOPT_URL, $requestUrl);
    curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($array));
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);


    $res = curl_exec($curl);
    curl_close($curl);

}