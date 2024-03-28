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

    let helpPopup = document.getElementById("popUpAide");

    let title;
    let imgLoad;
    let description;
    let nbImg;

    switch(id){
        case "helpCampaignArticle1":
            title="Comment créer une nouvelle campagne de mesure ?";
            imgLoad="filtrageHelp.gif";
            description="Vous pouvez filtrez par date.";
            nbImg=2;
            break;
        case "helpCampaignArticle2":
            title="Comment filtrer une campagne de mesure ?";
            imgLoad="createCampaign.gif";
            description="Durée : définit la durée d'une campagne de mesure. Vous pouvez changez l'unité de mesure en minute heure ou jour"+
            "\n Intervalle: ce paramètre sert à définir l'intervalle entre chaque prise de mesure.";
            nbImg=4;
            break;
        case "helpCampaignArticle3":
            title="Comment voir mes mesures sur Excel ?";
            imgLoad="filtrageHelp.gif";
            description="Vous pouvez filtrez par date.";
            nbImg=2;
            break;
        case "helpCampaignArticle4":
            title="Comment redémmarer ma campagne ?";
            imgLoad="filtrageHelp.gif";
            description="Vous pouvez filtrez par date.";
            nbImg=2;
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
        case "helpCalibrateArticle1":
            title="Enregistrer une nouvelle calibration";
            imgLoad="filtrageHelp.gif";
            description="Vous pouvez filtrez par date.";
            nbImg=2;
            break;
        case "helpConnexion":
            title="Connexion avec les questions de sécurité";
            imgLoad="connexionHelp.gif";
            description="Vous pouvez vous connectez grâce à vos questions de sécurité.";
            nbImg=2;
            break;
        case "":
            break;
    }

    helpPopup.innerHTML = `<p>${id}</p>`;

    /*helpPopup.innerHTML = `

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
                <input id="idhelpCampaign" hidden value=`+nbImg+`></input>
                <button class="rect_round_btn" type="button" onclick="nextGif()"> 
                    Next 
                </button>
            </div>
        </div>
    `;*/
    

    console.log("click");

}

function nextGif(){
    let id=document.getElementById("idhelpCampaign").value;
    console.log(id);
    if(id<3){
        const nb=parseInt(id)+1;
        document.getElementById("idhelpCampaign").value=nb;

        switch (id) {
            case 1:
                document.getElementById("HelpGif").src="/img/naméouie.gif";
                break;
    
            case 2:
                document.getElementById("HelpGif").src="/img/vulpix.gif";
                break;
    
            case 3:
                document.getElementById("HelpGif").src="/img/eiffel.gif";
                break;
                
            default:
                break;
        }
    }

}

function previousGif(){
    let id=document.getElementById("idhelpCampaign");

    if(id>1){
        id--;
        document.getElementById("idhelpCampaign").value=id;

        switch (id) {
            case 1:
                document.getElementById("HelpGif").src="/img/naméouie.gif";
                break;
            case 2:
                document.getElementById("HelpGif").src="/img/vulpix.gif";
                break;
            case 3:
                document.getElementById("HelpGif").src="/img/eiffel.gif";
                break;
        
            default:
                break;
        }
    }

}

