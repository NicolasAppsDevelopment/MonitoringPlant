function next(){
    document.getElementById("div_page1").classList.add("hidden");
    document.getElementById("div_page2").classList.remove("hidden");
}

async function setPassword(){
    displayLoading("Mise à jour du mot de passe...");

    const password1 = document.getElementById("password").value;
    const password2 = document.getElementById("confirm_password").value;
    if (password1 != password2) {
        await displayError("Impossible de définir le mot de passe", "Les mot de passe sont différents. Veuillez recommencer.");
        window.location.reload();
        return;
    } 

    const data = await PHP_post("/PHP_API/setPassword.php", {
        "password": password2,
    });
    
    if (data != null) {
        //window.location.href = "index.php";
    }
    
    hideLoading();
} 