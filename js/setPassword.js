/**
 * Displays the second form to define the administrator password.
 */
function next(){
    document.getElementById("div_page1").classList.add("hidden");
    let bar=document.getElementsByClassName("progression_bar");
    bar[0].style.width="20%";
    document.getElementById("div_page2").classList.remove("hidden");
}

/**
 * Sets the administrator password.
 */
async function setPassword(){
    displayLoading("Mise à jour du mot de passe...");

    const password1 = document.getElementById("password").value;
    const password2 = document.getElementById("confirm_password").value;
    if (password1 != password2) {
        await displayError("Impossible de définir le mot de passe", "Les mots de passe sont différents. Veuillez recommencer.");
        window.location.reload();
        return;
    } 

    const data = await phpPost("/phpApi/setPassword.php", {
        "password": password2,
    });
    
    if (data != null) {
        window.location.href = "setSecurityQuestions.php";
    }
    
    hideLoading();
} 