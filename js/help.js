async function deroule(id) {

    event.stopPropagation();

    let clickedElement= document.getElementById(id);



    if ( clickedElement.style.display == 'flex')

    clickedElement.style.display = 'none';

    else clickedElement.style.display = 'flex';



}



async function loadPopUp(id){

    console.log(id);
    event.stopPropagation();

    const helpPopup = document.getElementById("popUpAide");
    const display = document.getElementById("help-popup");

    let title;
    let imgLoad;
    let description;
    let nbImg;

    switch(id){
        case "helpIndexArticle1":
            title="Comment créer une nouvelle campagne de mesure ?";
            imgLoad="filtrageHelp.gif";
            description="Vous pouvez filtrez par date.";
            nbImg=2;
            break;
        case "helpIndexArticle2":
                title="Comment filtrer une campagne de mesure ?";
                imgLoad="createCampaign.gif";
                description="Durée : définit la durée d'une campagne de mesure. Vous pouvez changez l'unité de mesure en minute heure ou jour"+
                "\n Intervalle: ce paramètre sert à définir l'intervalle entre chaque prise de mesure.";
                nbImg=4;
                break;
        case "helpSettingsArticle1":
                title="Filtrage";
                imgLoad="filtrageHelp.gif";
                description="Vous pouvez filtrez par date.";
                nbImg=2;
                break;
        case "helpSettingsArticle2":
                title="Comment changer le nom du Wifi ?";
                imgLoad="filtrageHelp.gif";
                description="Vous pouvez filtrez par date.";
                nbImg=2;
                break;
        case "helpSeeDataArticle1":
                title="Comment voir mes mesures sur Excel ?";
                imgLoad="filtrageHelp.gif";
                description="Vous pouvez filtrez par date.";
                nbImg=2;
                break;
        case "helpSeeDataArticle2":
            title="Comment redémmarer ma campagne ?";
            imgLoad="filtrageHelp.gif";
            description="Vous pouvez filtrez par date.";
            nbImg=2;
            break;
        case "helpCalibrateArticle1":
            title="Enregistrer une nouvelle calibration";
            imgLoad="filtrageHelp.gif";
            description="Vous pouvez filtrez par date.";
            nbImg=2;
            break;
        case "":
            break;
    }

    helpPopup.innerHTML = `

    <div class="popupHelp popup">
            <div class="popup-inner">
                <div class="popup-title">
                    <p>`+title+`</p>
                    <label for="help-popup" class="round_btn transparent small close" onclick="loadPopUp()"></label>
                </div>
                <img id="HelpGif" src="/img/clock.svg" alt="image d'aide">
                <p> `+description+` </p>
                <div class="buttonPopupHelp">
                    <button class="rect_round_btn" type="button" onclick="previousGif()">
                        Previous
                    </button>
                    <input id="idHelpIndex" hidden value=`+nbImg+`></input>
                    <button class="rect_round_btn" type="button" onclick="nextGif()"> 
                        Next 
                    </button>
                </div>
            </div>
    `;
    if(display.value==1){
        display.value=0;
        helpPopup.style.display="flex";

    }else{
        display.value=1;
        helpPopup.style.display="none";

    }
    console.log("click");

}

