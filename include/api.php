<?php
const BASE_API_URL = "http://localhost:8080";

function post(string $url, array $data) : mixed {

    $url = BASE_API_URL . $url;
    
    // use key 'http' even if you send the request to https://...
    $options = [
        'http' => [
            'header' => "Content-type: application/x-www-form-urlencoded\r\n",
            'method' => 'POST',
            'content' => http_build_query($data),
        ],
    ];
    
    $context = stream_context_create($options);
    $result = file_get_contents($url, false, $context);
    if ($result === false) {
        /* Handle error */
    }
    
    return json_decode($result);
}

function get(string $url, array $data = []) : mixed {

    $url = BASE_API_URL . $url;
    
    // use key 'http' even if you send the request to https://...
    $options = [
        'http' => [
            'header' => "Content-type: application/x-www-form-urlencoded\r\n",
            'method' => 'GET',
            'content' => $data,
        ],
    ];
    
    $context = stream_context_create($options);
    $result = file_get_contents($url, false, $context);
    if ($result === false) {
        /* Handle error */
    }
    
    return json_decode($result);
}
