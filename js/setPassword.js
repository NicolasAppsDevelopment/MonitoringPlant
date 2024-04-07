let bar;

document.addEventListener("DOMContentLoaded", () => {
    bar = document.getElementsByClassName("progression_bar")[0];
});

/**
 * Displays the second form to confirm the administrator password.
 */
function next(){
    document.getElementById("div_page1").classList.add("hidden");
    bar.style.width = "20%";
    document.getElementById("div_page2").classList.remove("hidden");
}

/**
 * Displays the first form to define the administrator password.
 */
function previous(){
    document.getElementById("div_page2").classList.add("hidden");
    bar.style.width = "0%";
    document.getElementById("div_page1").classList.remove("hidden");
}

/**
 * Send a request to the server to set the password and redirect the user to the next page.
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

    const data = await phpPost("phpApi/setPassword.php", {
        "password": password2,
    });
    
    if (data != null) {
        window.location.href =  data["redirect"];
    }
    
    hideLoading();
} 