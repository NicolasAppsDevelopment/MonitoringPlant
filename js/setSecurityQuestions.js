let question1;
let response1;
let question2;
let response2;
let question3;
let response3;

document.addEventListener("DOMContentLoaded", () => {
    let bar = document.getElementsByClassName("progression_bar");
    bar[0].style.width="40%";
});

/**
 * Display the first form to define the first question and its response.
 */
function goToForm1(){
    document.getElementById("div_page3").classList.add("hidden");
    document.getElementById("div_page2").classList.add("hidden");
    bar[0].style.width="40%";
    document.getElementById("div_page1").classList.remove("hidden");
}

/**
 * Display the second form to define the second question and its response.
 */
function goToForm2(){
    document.getElementById("div_page3").classList.add("hidden");
    document.getElementById("div_page1").classList.add("hidden");
    bar[0].style.width="60%";
    document.getElementById("div_page2").classList.remove("hidden");
}

/**
 * Display the third form to definie the third question and its response.
 */
function goToForm3(){
    question1 = document.getElementById("question1").value;
    response1 = document.getElementById("response1").value;
    question2 = document.getElementById("question2").value;
    response2 = document.getElementById("response2").value;

    if (question1==question2){
        displayError("Impossible de continuer", "Certaines questions ont le même intitulé. Veuillez recommencer.");
    } 
    if (response1==response2){
            displayError("Impossible de continuer", "Certaines questions ont la même réponse. Veuillez recommencer.");
    }
    if (question1!=question2 &&  response1!=response2){
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
    question1 = document.getElementById("question1").value;
    response1 = document.getElementById("response1").value;
    question2 = document.getElementById("question2").value;
    response2 = document.getElementById("response2").value;
    question3 = document.getElementById("question3").value;
    response3 = document.getElementById("response3").value;

    if (question1==question3 || question2==question3){
        displayError("Impossible de définir les questions de sécurités", "Certaines questions ont le même intitulé. Veuillez recommencer.");
    } 

    if (response1==response3 || response2==response3){
        displayError("Impossible de définir les questions de sécurités", "Certaines questions ont la même réponse. Veuillez recommencer.");
    } 

    if (question1!=question3 && question2!=question3 && response1!=response3 && response2!=response3){
        displayLoading("Enregistrement des questions de sécurité....");

        //Register the questions and their responses into the database.
        const data = await phpPost("phpApi/setSecurityQuestions.php", {
            "question1": question1,
            "response1": response1,
            "question2": question2,
            "response2": response2,
            "question3": question3,
            "response3": response3
        });

        if (data != null) {
            window.location.href = data["redirect"];
        }
        
        hideLoading();
    }
} 