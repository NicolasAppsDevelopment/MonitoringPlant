<?php

include_once __DIR__ . "/../include/reply.php";

use Database;

class SettingsManager {
    /**
     * @var SettingsManager
     * @access private
     * @static
     */
    private static $_instance = null;

    /**
     * @var Database
     * @access private
     */
    private $db = null;
    
    /**
     * Default constructor
     *
     * @param void
     * @return void
     */
    private function __construct() {
        self::$db = Database::getInstance();
    }
    
    /**
     * Create unique instance of the class
     * if it doesn't exists then return it
     *
     * @param void
     * @return SettingsManager
     */
    public static function getInstance() {
    
        if(is_null(self::$_instance)) {
        self::$_instance = new SettingsManager();
        }
    
        return self::$_instance;
    }

    /**
     * Description.
     *
     * @param {string} message
     * @return {string}
     */
    //Recovery of Raspbery Pi settings
    public function getSettings() : array
    {
        try {
            $data = self::$db->fetchAll("SELECT * , NOW() AS 'date' FROM Settings");
            if (count($data) > 0) {
                return $data[0];
            } else {
                header("Location: /beginning.php");
                return [];
            }
        } catch (\Throwable $th) {
            throw new Exception("Impossible de récupérer les paramètres du Raspberry Pi. {$th->getMessage()}");
        }
    }

    /**
     * Description.
     *
     * @param {string} message
     * @return {string}
     */
    //Defines new Raspbery Pi settings
    public function setSettings(int $supprInterval, bool $enabled) : bool
    {
        try {
            self::$db->fetchAll("DELETE FROM Settings");
            self::$db->fetchAll("INSERT INTO Settings VALUES (:varSuppr, :varEnabled)", [
                'varSuppr' => $supprInterval,
                'varEnabled' => (int)$enabled
            ]);
            return true;
        } catch (\Throwable $th) {
            throw new Exception("Impossible de modifier les paramètres. {$th->getMessage()}");
        }
    }
}
