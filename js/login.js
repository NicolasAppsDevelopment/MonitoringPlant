/**
 * Checks that the password entered by the user is the administrator password.
 */
async function login(){
    displayLoading("Connexion...");

    const password = document.getElementById("password").value;
    const data = await phpPost("phpApi/login.php", {
        "password": password,
    });
    
    if (data != null) {
        window.location.href = "./listCampaign.php";
    }
    
    hideLoading();
} 