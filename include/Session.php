<?php

require_once 'Database.php';

/**
 * This class is a singleton that allows you to manage user sessions.
 */
class Session {
    /**
     * Session singleton class instance
     * @var Session
     * @access private
     * @static
     */
    private static $instance = null;

    /**
     * Database singleton class instance
     * @var Database
     * @access private
     */
    private $db = null;
    
    /**
     * Default constructor
     */
    private function __construct() {
        $this->db = Database::getInstance();
    }
    
    /**
     * Creates unique instance of the class
     * if it doesn't exists then return it
     *
     * @return Session
     */
    public static function getInstance() {
        self::initSession();

        if(is_null(self::$instance)) {
            self::$instance = new Session();
        }
    
        return self::$instance;
    }

    /**
     * Initiates a session
     */
    private static function initSession(): void {
        // always start the session when we need to access session data
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }
    }


    /**
     * Returns true if the password is correct for a user entered in parameter.
     *
     * @param string $user The user name
     * @param string $password The password
     * @throws Exception Can throw exceptions during the execution of the SQL query.
     * @return bool
     */
    public function login(string $username, string $password): bool {
        try {
            $hashData = $this->db->fetchAll("SELECT password FROM Users WHERE user = :varUsername", [
                'varUsername' => htmlspecialchars($username)
            ]);

            if (!empty($hashData)) {
                if (password_verify($password, $hashData[0]["password"])) {
                    $_SESSION['logged'] = true;
                    if ($username == "admin"){
                        $_SESSION['admin'] = true;
                    }
                    return true;
                }
                return false;
            } else {
                return false;
            }
        } catch (\Throwable $th) {
            throw new Exception("Impossible de se connecter. {$th->getMessage()}");
        }
    }

    /**
     * Returns hashed password.
     *
     * @param string $password The password
     * @return string
     */
    public function hashPwd(string $password) : string
    {
        return password_hash($password, PASSWORD_DEFAULT);
    }

    /**
     * Registers the user with his password into the database (the password will be stored hashed)
     * @param string $password The password (not hashed)
     * @throws Exception Can throw exceptions during the execution of the SQL query.
     */
    public function registerAdmin(string $password)
    {
        try {
            $this->db->fetchAll("INSERT INTO Users VALUES (null, 'admin', :varPassword)", [
                'varPassword' => self::hashPwd($password),
            ]);
        } catch (\Throwable $th) {
            throw new Exception("Impossible d'enregistrer l'administrateur. {$th->getMessage()}");
        }
    }

    /**
     * Modifies the password of the admin into the database (the password will be stored hashed)
     *
     * @param string $password The password (not hashed)
     * @throws Exception Can throw exceptions during the execution of the SQL query.
     */
    public function updateAdminPassword(string $password)
    {
        try {
            $this->db->fetchAll("UPDATE Users SET password = :varPassword WHERE user = 'admin'", [
                'varPassword' => self::hashPwd($password),
            ]);
        } catch (\Throwable $th) {
            throw new Exception("Impossible de modifier le mot de passe de l'administrateur. {$th->getMessage()}");
        }
    }

    /**
     * Returns the user id of the admin.
     * @throws Exception Can throw exceptions during the execution of the SQL query.
     */
    public function getAdminUserId() : int
    {
        try {
            $res = $this->db->fetchAll("SELECT idUser FROM Users WHERE user = 'admin'");
            return $res[0]["idUser"];
        } catch (\Throwable $th) {
            throw new Exception("Impossible de récupérer l'identifiant de l'administrateur. {$th->getMessage()}");
        }
    }

    /**
     * Logout the current user
     */
    public function logout() {
        $_SESSION = array();
        session_destroy();
    }

    /**
     * Returns true if the admin is registered in the database.
     * @throws Exception Can throw exceptions during the execution of the SQL query.
     * @return bool
     */
    public function isAdminDefined(): bool {
        try {
            $results = $this->db->fetchAll("SELECT user FROM Users WHERE user = 'admin'");
        
            return !empty($results);
        } catch (\Throwable $th) {
            throw new Exception("Impossible de vérifier si l'administrateur a déjà un compte. {$th->getMessage()}");
        }
    }

    /**
     * Returns true if a user is logged.
     *
     * @return bool
     */
    public function isLogged(): bool {
        return isset($_SESSION["logged"]) && $_SESSION["logged"];
    }

    /**
     * Returns true if the logged user is an admin.
     *
     * @return bool
     */
    public function isAdmin(): bool {
        return self::isLogged() && $_SESSION["admin"] && $_SESSION["admin"];
    }

    /**
     * Redirects the user to the login page if they are not logged in as admin and are on an admin-only page.
     */
    public function checkPageAccess() {
        if (!self::isAdmin()) {
            header("Location: /login.php");
            exit;
        }
    }
}
