<?php

function reply($data){
    echo json_encode($data);
    exit();
}

function replyError(string $title, string $msg, int $error_code = 500){
    http_response_code($error_code);

    $encoding = mb_detect_encoding($msg, 'utf-8, iso-8859-1, ascii', true);
    if (strcasecmp($encoding, 'UTF-8') !== 0) {
      $msg_cleared = iconv($encoding, 'utf-8', $msg);
    }
    $msg_cleared = str_replace("\u{92}", "'", $msg_cleared);

    echo json_encode(array(
        "title" => htmlspecialchars($title),
        "error" => htmlspecialchars($msg_cleared)
    ));

    exit();
}