<?php

include_once __DIR__ . "/database.php";

function initSession(): void { 
    // always start the session when we need to access session data
    session_start();
}


/**
 * Returns true if the password is correct for a user entered in parameter.
 * 
 * @param string $user The user name
 * @param string $password The password
 * @return bool
 */
function login(string $username, string $password): bool {
    try {
        $hashData = fetchAll("SELECT password FROM Users WHERE user = :varUsername", [
            'varUsername' => htmlspecialchars($username)
        ]);

        if (count($hashData) > 0) {
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
        replyError("Impossible de se connecter", $th->getMessage());
    }
}

/**
 * Returns hashed password.
 * 
 * @param string $password The password
 * @return string
 */
function hash_pwd(string $password) : string
{
    return password_hash($password, PASSWORD_DEFAULT);
}

/**
 * Register the user with his password into the database (the password will be stored hashed)
 * 
 * @param string $password The password (not hashed)
 */
function registerAdmin(string $password)
{
    try {
        fetchAll("INSERT INTO Users VALUES (null, 'admin', :varPassword)", [
            'varPassword' => hash_pwd($password),
        ]);
    } catch (\Throwable $th) {
        replyError("Impossible d'enregistrer l'administrateur.", $th->getMessage());
    }
}

/**
 * Modify the password of the admin into the database (the password will be stored hashed)
 * 
 * @param string $password The password (not hashed)
 */
function updateAdminPassword(string $password)
{
    try {
        fetchAll("UPDATE Users SET password = :varPassword WHERE user = 'admin'", [
            'varPassword' => hash_pwd($password),
        ]);
    } catch (\Throwable $th) {
        replyError("Impossible de modifier le mot de passe de l'administrateur.", $th->getMessage());
    }
}


/**
 * Register the user with his password into the database (the password will be stored hashed)
 * 
 * @param string $password The password (not hashed)
 */
function registerAdminQuestions(string $question,string $response)
{
    try {
        fetchAll("INSERT INTO Questions VALUES ('admin', :question, :response)", [
            'question' => $question, 
            'response' => $response

        ]);
    } catch (\Throwable $th) {
        replyError("Impossible d'enregistrer les réponses et questions de sécurité.", $th->getMessage());
    }
}

/**
 * Modify the password of the admin into the database (the password will be stored hashed)
 * 
 * @param string $password The password (not hashed)
 */
function updateAdminQuestions(string $question1,string $response1,string $question2,string $response2,string $question3,string $response3)
{
    try {
        fetchAll("DELETE FROM Questions WHERE user = 'admin'");
        fetchAll("INSERT INTO Questions VALUES ('admin', :question1, :response1)", [
            'question1' => $question1, 
            'response1' => $response1

        ]);
        fetchAll("INSERT INTO Questions VALUES ('admin', :question2, :response2)", [
            'question2' => $question2, 
            'response2' => $response2

        ]);
        fetchAll("INSERT INTO Questions VALUES ('admin', :question3, :response3)", [
            'question3' => $question3, 
            'response3' => $response3

        ]);
    } catch (\Throwable $th) {
        replyError("Impossible de modifier les réponses et questions de sécurité.", $th->getMessage());
    }
}

/**
 * Logout the current user
 */
function logout() {
    $_SESSION = array();
    session_destroy();
}

/**
 * Returns true if the admin is registered in the database.
 * 
 * @return bool
 */
function isAdminDefined(): bool {
    try {
        $results = fetchAll("SELECT user FROM Users WHERE user = 'admin'");
    
        if (count($results) > 0) {
            return true;
        } else {
            return false;
        }
    } catch (\Throwable $th) {
        replyError("Impossible de vérifier si l'administrateur a déjà un compte.", $th->getMessage());
    }
}

/**
 * Returns true if a user is logged.
 * 
 * @return bool
 */
function isLogged(): bool {
    return isset($_SESSION["logged"]) && $_SESSION["logged"] == true; 
}

/**
 * Returns true if the logged user is an admin.
 * 
 * @return bool
 */
function isAdmin(): bool {
    return isLogged() && $_SESSION["admin"] && $_SESSION["admin"] == true; 
}

/**
 * Returns true if the logged user is an admin.
 * 
 * @return bool
 */
function checkPageAccess(): void {
    if (!isAdmin()) {
        header("Location: /login.php");
        exit;
    } 
}