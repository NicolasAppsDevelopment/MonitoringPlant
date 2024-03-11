
//à faire après initialisation des éléments html
/*const question1 = document.getElementById("question1").value;
const response1 = document.getElementById("response1").value;
const question2 = document.getElementById("question2").value;
const response2 = document.getElementById("response2").value;
const question3 = document.getElementById("question3").value;
const response3 = document.getElementById("response3").value;

let bar=document.getElementsByClassName("progression_bar");
bar[0].style.width="40%";*/


function next1(){
    if (question1!=question2  && response1!=response2){
        document.getElementById("div_page1").classList.add("hidden");
        bar[0].style.width="60%";
        document.getElementById("div_page2").classList.remove("hidden");
    }
}

function next2(){
    if (question1!=question2  && response1!=response2 && question1!=question3  && response1!=response3 && question2!=question3  && response2!=response3){
        document.getElementById("div_page2").classList.add("hidden");
        bar[0].style.width="80%";
        document.getElementById("div_page3").classList.remove("hidden");
    }
}

function previous1(){  
    document.getElementById("div_page2").classList.add("hidden");
    bar[0].style.width="40%";
    document.getElementById("div_page1").classList.remove("hidden");
}

function previous2(){
    document.getElementById("div_page3").classList.add("hidden");
    bar[0].style.width="60%";
    document.getElementById("div_page2").classList.remove("hidden");
}

async function setSecurityQuestions(){
    displayLoading("Mise à jour du mot de passe...");
    
    if (password1 != password2) {
        await displayError("Impossible de définir le mot de passe", "Les mot de passe sont différents. Veuillez recommencer.");
        window.location.reload();
        return;
    } 

    const data = await PHP_post("/PHP_API/setSecurityQuestions.php", {
        "password": password2,
    });
    
    if (data != null) {
        window.location.href = data["redirect"];
    }
    
    hideLoading();
} 