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
 * Display the first form to define the first question and its response.
 */
function gotform1(){
    document.getElementById("div_page3").classList.add("hidden");
    document.getElementById("div_page2").classList.add("hidden");
    bar[0].style.width="40%";
    document.getElementById("div_page1").classList.remove("hidden");
}

/**
 * Display the second form to define the second question and its response.
 */
function gotform2(){
    document.getElementById("div_page3").classList.add("hidden");
    document.getElementById("div_page1").classList.add("hidden");
    bar[0].style.width="60%";
    document.getElementById("div_page2").classList.remove("hidden");
}

/**
 * Display the third form to definie the third question and its response.
 */
function gotform3(){
    if (question1!=question2  && response1!=response2){
        document.getElementById("div_page1").classList.add("hidden");
        document.getElementById("div_page2").classList.add("hidden");
        bar[0].style.width="80%";
        document.getElementById("div_page3").classList.remove("hidden");
    }
}

/**
 * Register the questions and their responses into the database.
 */
async function setSecurityQuestions(){
    displayLoading("Mise à jour du mot de passe...");
    
    if (question1==question2 || response1!=response2 || question1!=question3  || response1!=response3 || question2!=question3  || response2!=response3){
        await displayError("Impossible de définir les questions de sécurités", "Certaines questions ont le même intitulé et/ou la même réponse. Veuillez recommencer.");
        window.location.reload();
        return;
    } 

    //Register the questions and their responses into the database.
    const data = await phpPost("/phpApi/setSecurityQuestions.php", {
        "question1": question1,
        "response1": response1,
        "question1": question2,
        "response1": response2,
        "question1": question3,
        "response1": response3
    });
    
    
    if (data != null) {
        window.location.href = data["redirect"];
    }
    
    hideLoading();
} 