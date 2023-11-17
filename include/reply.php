<?php

function reply($data){
    echo json_encode($data);
    exit();
}

function replyError(string $title, string $msg, int $error_code = 500){
    http_response_code($error_code);
    echo json_encode(array(
        "title" => htmlspecialchars($title),
        "error" => htmlspecialchars($msg)
    ));
    exit();
} 