let question1LabelComponent;
let question2LabelComponent;
let question3LabelComponent;

document.addEventListener("DOMContentLoaded", async () => {  
    displayLoading("Récupération des questions de sécurité...");
    
    question1LabelComponent = document.getElementById("question1");
    question2LabelComponent = document.getElementById("question2");
    question3LabelComponent = document.getElementById("question3");

    bar=document.getElementsByClassName("progression_bar");
    bar[0].style.width="40%";

    const data = await phpGet("phpApi/getSecurityQuestions.php");
    if (data != null){
        question1LabelComponent.innerHTML=data[0]["question"];
        question2LabelComponent.innerHTML=data[1]["question"];
        question3LabelComponent.innerHTML=data[2]["question"];
    }

    hideLoading();
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
    displayLoading("Connexion...");

    response1 = document.getElementById("response1").value;
    response2 = document.getElementById("response2").value;
    response3 = document.getElementById("response3").value;
    
    const data = await phpPost("phpApi/alternativeLogin.php", {
        "question1": question1LabelComponent.innerHTML,
        "response1": response1,
        "question2": question2LabelComponent.innerHTML,
        "response2": response2,
        "question3": question3LabelComponent.innerHTML,
        "response3": response3
    });
    
    
    if (data != null){
        window.location.href = "./listCampaign.php";
        return;
    }
    
    hideLoading();
} 