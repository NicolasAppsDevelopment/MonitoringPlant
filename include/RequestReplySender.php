<?php

/**
 * This class is a singleton that allows you to send a reply to the client in a standardized way.
 */
class RequestReplySender {
    /**
     * RequestReplySender singleton class instance
     * @var RequestReplySender
     * @access private
     * @static
     */
    private static $instance = null;
    
    /**
     * Default constructor
     */
    private function __construct() {
    }
    
    /**
     * Creates unique instance of the class
     * if it doesn't exists then return it
     *
     * @return RequestReplySender
     */
    public static function getInstance() {
        header("Content-Type: application/json; charset=utf-8");

        if(is_null(self::$instance)) {
            self::$instance = new RequestReplySender();
        }
    
        return self::$instance;
    }

    /**
     * Reply to the client with a 200 error code and JSON data {"success": true, "data": [...]}
     * where [...] is your array of data.
     * @param mixed $data - Array data to reply
     */
    public function replyData($data){
        echo json_encode(array(
            "success" => true,
            "data" => $data
        ));
        exit();
    }

    /**
     * Reply to the client with a 200 error code and JSON data {"success": true}
     */
    public function replySuccess(){
        echo json_encode(array(
            "success" => true
        ));
        exit();
    }

    /**
     * Reply to the client with a 500 error code and JSON data about the error {"success": false, "error": {"title": "Error title", "message": "Error message"}}
     * @param string $title - Title of the exception
     * @param Throwable $ex - Throwable error object
     */
    public function replyError(string $title, Throwable $ex){
        http_response_code(500);

        $msg_cleared = $ex->getMessage();
        $encoding = mb_detect_encoding($msg_cleared, 'utf-8, iso-8859-1, ascii', true);
        if (strcasecmp($encoding, 'UTF-8') !== 0) {
            $msg_cleared = iconv($encoding, 'utf-8', $msg_cleared);
        }
        $msg_cleared = str_replace("\u{92}", "'", $msg_cleared);

        echo json_encode(array(
            "success" => false,
            "error" => [
                "title" => htmlspecialchars($title),
                "message" => htmlspecialchars($msg_cleared)
            ]
        ));
        exit();
    }
}
