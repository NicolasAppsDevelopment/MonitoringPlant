async function login(){
    displayLoading("Connexion...");

    const password = document.getElementById("password").value;
    const data = await PHP_post("/PHP_API/login.php", {
        "password": password,
    });
    
    if (data != null) {
        window.location.href = "./listCampaign.php";
    }
    
    hideLoading();
} 