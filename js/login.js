/**
 * Attempt to login the user (by sending a verification request to the server) with the password provided in the input field.
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