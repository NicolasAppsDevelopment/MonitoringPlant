document.addEventListener("DOMContentLoaded", () => {
    const question1 = document.getElementById("question1").value;
    const response1 = document.getElementById("response1").value;
    const question2 = document.getElementById("question2").value;
    const response2 = document.getElementById("response2").value;
    const question3 = document.getElementById("question3").value;
    const response3 = document.getElementById("response3").value;

    bar=document.getElementsByClassName("progression_bar");
    bar[0].style.width="40%";
});

/**
 * Display the first form to answer the first security question.
 */
function goToForm1(){
    document.getElementById("div_page3").classList.add("hidden");
    document.getElementById("div_page2").classList.add("hidden");
    bar[0].style.width="0%";
    document.getElementById("div_page1").classList.remove("hidden");
}

/**
 * Display the second form to answer the second security question.
 */
function goToForm2(){
    document.getElementById("div_page3").classList.add("hidden");
    document.getElementById("div_page1").classList.add("hidden");
    bar[0].style.width="30%";
    document.getElementById("div_page2").classList.remove("hidden");
}

/**
 * Display the third form to answer the third security question.
 */
function goToForm3(){
    if (question1!=question2  && response1!=response2){
        document.getElementById("div_page1").classList.add("hidden");
        document.getElementById("div_page2").classList.add("hidden");
        bar[0].style.width="60%";
        document.getElementById("div_page3").classList.remove("hidden");
    }
}

/**
 * Verifies that the responses match those defined by the administrator.
 */
async function alternativeLogin(){
    displayLoading("Mise à jour du mot de passe...");
    
    //Register the questions and their responses into the database.
    const data = await phpPost("/phpApi/alternativeLogin.php", {
        "question1": question1,
        "response1": response1,
        "question1": question2,
        "response1": response2,
        "question1": question3,
        "response1": response3
    });
    
    
    if (data===true){
        await displaySuccess("Authentification réussie", "Les réponses sont correctes. Bienvenu(e) Administrateur(rice) !");
        window.location.href = "./listCampaign.php";
    } else {
        await displayError("Erreur d'authentification", "Les réponses sont incorrectes. Veuillez recommencer.");
        window.location.reload();
        return;
    }
    
    hideLoading();
} 