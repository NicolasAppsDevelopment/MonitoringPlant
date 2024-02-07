<?php

/**
 * @param mixed $data
 */
function reply($data){
    echo json_encode($data);
    exit();
}
/**
 * @param string $title
 * @param string $msg
 * @param int $error_code
 */
function replyError(string $title, string $msg, int $error_code = 500){
    http_response_code($error_code);
    $msg_cleared = $msg;
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