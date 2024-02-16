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
 * @return values  $res is the data that NodeRed send back, it can be a interger, string, etc... 
 */
function NodeRedPost(string $name, array $array)
{
    global $NODE_RED_API_IP, $NODE_RED_API_PORT, $NODE_RED_API_URL;

    $url = "$NODE_RED_API_URL/$name";

    //$requestUrl = $url . "/" . $name;
    $curl = curl_init($url);
    curl_setopt($curl, CURLOPT_POST, true);
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($url));
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($array));
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

    $res = curl_exec($curl);
    curl_close($curl);
    return json_decode($res, true);

}

/**
 * This function send a get request to Node Red which reply.
 * @param  string $name the name of the Node Red request will receive. This string must not contains any special characters.
 * @return values  $res is the data that NodeRed send back, it can be a interger, string, etc... 
 */
function NodeRedGet(string $name) {
    global $NODE_RED_API_IP, $NODE_RED_API_PORT, $NODE_RED_API_URL;

    $url = "$NODE_RED_API_URL/$name";

    $curl = curl_init($url);
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

    $res = curl_exec($curl);
    curl_close($curl);
    return json_decode($res, true);
}