<?php
//Node-RED access configuration
global $NODE_RED_API_IP, $NODE_RED_API_PORT, $NODE_RED_API_URL;
$NODE_RED_API_IP = "192.168.4.1";
$NODE_RED_API_PORT = "1880";
$NODE_RED_API_URL = "http://$NODE_RED_API_IP:$NODE_RED_API_PORT";

/**
 * This function send a post request to Node Red and Node Red reply with a sucess or a failure.
 * @param  string $name the name of the Node Red request will receive. This string must not contains any special characters.
 * @param array $array the parameters that you want to transmir to Node Red
 */
function NodeRedPost(string $name, array $array)
{
    $NodeRedUrl = 'http://192.168.4.1:1880';
    
    $cle=$array;
    $cle["cle"]="zheC4keIS4L1V3?!!!";

    $requestUrl = $NodeRedUrl . "/" . $name;
    $curl = curl_init($requestUrl);
    curl_setopt($curl, CURLOPT_POST, true);
    curl_setopt($curl, CURLOPT_URL, $requestUrl);
    curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($cle));
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);


    $res = curl_exec($curl);
    curl_close($curl);
    return $res;

}