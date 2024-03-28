<?php
//Node-JS access configuration
global $NODE_JS_API_IP, $NODE_JS_API_PORT, $NODE_JS_API_URL, $NODE_JS_API_TOKEN;
$NODE_JS_API_IP = "127.0.0.1";
$NODE_JS_API_PORT = "1881";
$NODE_JS_API_URL = "http://$NODE_JS_API_IP:$NODE_JS_API_PORT";
$NODE_JS_API_TOKEN = "KwY7dqKSFAf0EkzBPwt6x9eTDAEiM8Ul0OQDMqGJLTKBli4qceJQlAMtirOD8GdC";

/**
 * This function send a post request to Node JS and Node JS reply with a sucess or a failure.
 * @param  string $name the name of the Node JS request will receive. This string must not contains any special characters.
 * @param array $array the parameters that you want to transmir to Node JS
 * @return values  $res is the data that NodeJS send back, it can be a interger, string, etc... 
 */
function NodeJsPost(string $name, array $array)
{
    global $NODE_JS_API_URL, $NODE_JS_API_TOKEN;
    $url = "$NODE_JS_API_URL/$name";
    $curl = curl_init($url);

    curl_setopt($curl, CURLOPT_POST, true);
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_FAILONERROR, false); // do not fail on HTTP error
    curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($array));
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_HEADER, true); // Inclure l'en-tête dans la sortie
    curl_setopt($curl, CURLOPT_HTTPHEADER, ['Content-Type: application/json', 'Authorization: ' . $NODE_JS_API_TOKEN]);

    $res = curl_exec($curl);
    $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    $returnedError = "";

    if ($httpCode != 200) {
        try {
            // Try get error message from server response
            $headerSize = curl_getinfo($curl, CURLINFO_HEADER_SIZE);
            $body = substr($res, $headerSize);
            curl_close($curl);
            $returnedError = json_decode($body, true)["error"];
        } catch (\Throwable $_) {}
    }

    if (curl_errno($curl)) {
        $error_msg = curl_error($curl);
        curl_close($curl);
        throw new Exception("Erreur d'émission/réception de la requête POST. La requête vers l'adresse \"$url\" n'a pas pu être émise/reçu correctement... $error_msg $returnedError");
    }

    curl_close($curl);
    return json_decode($res, true);
}

/**
 * This function send a get request to Node JS which reply.
 * @param  string $name the name of the Node JS request will receive. This string must not contains any special characters.
 * @return array  $res is the data that NodeJS send back, it can be a interger, string, etc... 
 */
function NodeJsGet(string $name)
{
    global $NODE_JS_API_URL, $NODE_JS_API_TOKEN;
    $url = "$NODE_JS_API_URL/$name";
    $curl = curl_init($url);

    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_FAILONERROR, false); // do not fail on HTTP error
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_HEADER, true); // Inclure l'en-tête dans la sortie
    curl_setopt($curl, CURLOPT_HTTPHEADER, ['Authorization: ' . $NODE_JS_API_TOKEN]);

    $res = curl_exec($curl);
    $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    $returnedError = "";

    if ($httpCode != 200) {
        try {
            // Try get error message from server response
            $headerSize = curl_getinfo($curl, CURLINFO_HEADER_SIZE);
            $body = substr($res, $headerSize);
            curl_close($curl);
            $returnedError = json_decode($body, true)["error"];
        } catch (\Throwable $_) {}
    }

    if (curl_errno($curl)) {
        $error_msg = curl_error($curl);
        curl_close($curl);
        throw new Exception("Erreur d'émission/réception de la requête GET. La requête vers l'adresse \"$url\" n'a pas pu être émise/reçu correctement... $error_msg $returnedError");
    }

    curl_close($curl);
    return json_decode($res, true);
}
