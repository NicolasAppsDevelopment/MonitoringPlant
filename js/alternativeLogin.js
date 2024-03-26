let response1;
let response2;
let response3;

let question1;
let question2;
let question3;

document.addEventListener("DOMContentLoaded", () => {    
    question1 = document.getElementById("question1").innerHTML;
    question2 = document.getElementById("question2").innerHTML;
    question3 = document.getElementById("question3").innerHTML;

    bar=document.getElementsByClassName("progression_bar");
    bar[0].style.width="40%";

    const data = phpGet("/phpApi/getSecurityQuestions.php")
    console.log(data);
    question1=data[0];
    question2=data[1];
    question3=data[2];

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
    document.getElementById("div_page1").classList.add("hidden");
    document.getElementById("div_page2").classList.add("hidden");
    bar[0].style.width="60%";
    document.getElementById("div_page3").classList.remove("hidden");
}

/**
 * Verifies that the responses match those defined by the administrator.
 */
async function alternativeLogin(){
    displayLoading("Mise à jour des questions de sécurité...");

    response1 = document.getElementById("response1").value;
    response2 = document.getElementById("response2").value;
    response3 = document.getElementById("response3").value;
    
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