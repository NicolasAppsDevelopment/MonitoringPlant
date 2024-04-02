document.addEventListener("DOMContentLoaded", () => {
    closePopup('help-popup')
});


async function deroule(id) {

    event.stopPropagation();

    let clickedElement= document.getElementById(id);



    if ( clickedElement.style.display == 'flex')

    clickedElement.style.display = 'none';

    else clickedElement.style.display = 'flex';



}

async function loadPopUp(id){
    event.stopPropagation();

    let helpPopup = document.getElementById("popUpAide");

    switch(id){
        case "helpCampaignArticle1":
            helpPopup.innerHTML = `
                <div class="popup-inner">
                    <div class="popup-title">
                        <p>Comment créer une nouvelle campagne de mesure ?</p>
                        <label for="help-popup" class="round_btn transparent small close" onclick="closeHelpPopUp()"></label>
                    </div>
                    <video id="video" controls>
                        <source src="../video/ppp.mp4" type="video/mp4" />
                    </video>
                    <p>
                        Durée : définit la durée d'une campagne de mesure. Vous pouvez changez l'unité de mesure en minute heure ou jour <br/>
                        Intervalle: ce paramètre sert à définir l'intervalle entre chaque prise de mesure. 
                    </p>
                </div>
            `;
            break;
        case "helpCampaignArticle2":
            helpPopup.innerHTML = `
                <div class="popup-inner">
                    <div class="popup-title">
                        <p> Comment filtrer les campagnes de mesure ? </p>
                        <label for="help-popup" class="round_btn transparent small close" onclick="closeHelpPopUp()"></label>
                    </div>
                    <video id="video" controls>
                        <source src="../video/ppp.mp4" type="video/mp4" />
                    </video>
                    <p> Vous pouvez filtrez par date. </p>
                </div>
            `;
            break;
        case "helpCampaignArticle3":
            helpPopup.innerHTML = `
                <div class="popup-inner">
                    <div class="popup-title">
                        <p>Comment télécharger les mesures ?</p>
                        <label for="help-popup" class="round_btn transparent small close" onclick="closeHelpPopUp()"></label>
                    </div>
                    <video id="video" controls>
                        <source src="../video/ppp.mp4" type="video/mp4" />
                    </video>
                    <p> Vous pouvez filtrez par date. </p>
                </div>
            `;
            break;
        case "helpCampaignArticle4":
            helpPopup.innerHTML = `
                <div class="popup-inner">
                    <div class="popup-title">
                        <p>Comment redémmarer ma campagne ?</p>
                        <label for="help-popup" class="round_btn transparent small close" onclick="closeHelpPopUp()"></label>
                    </div>
                    <video id="video" controls>
                        <source src="../video/ppp.mp4" type="video/mp4" />
                    </video>
                    <p> Vous pouvez filtrez par date. </p>
                </div>
            `;
            break;
        case "helpSettingsArticle1":
            helpPopup.innerHTML = `
                <div class="popup-inner">
                    <div class="popup-title">
                        <p>Comment marche la Suppression automatique ?</p>
                        <label for="help-popup" class="round_btn transparent small close" onclick="closeHelpPopUp()"></label>
                    </div>
                    <video id="video" controls>
                        <source src="../video/ppp.mp4" type="video/mp4" />
                    </video>
                    <p> Vous pouvez filtrez par date. </p>
                </div>
            `;
            break;
        case "helpSettingsArticle2":
            helpPopup.innerHTML = `
                <div class="popup-inner">
                    <div class="popup-title">
                        <p>Comment changer le nom du Wifi ?</p>
                        <label for="help-popup" class="round_btn transparent small close" onclick="closeHelpPopUp()"></label>
                    </div>
                    <video id="video" controls>
                        <source src="../video/ppp.mp4" type="video/mp4" />
                    </video>
                    <p> Vous pouvez filtrez par date. </p>
                </div>
            `;
            break;
        case "helpCalibrateArticle1":
            helpPopup.innerHTML = `
                <div class="popup-inner">
                    <div class="popup-title">
                        <p>Comment enregistrer une nouvelle calibration ?</p>
                        <label for="help-popup" class="round_btn transparent small close" onclick="closeHelpPopUp()"></label>
                    </div>
                    <video id="video" controls>
                        <source src="../video/Ezekiel.mp4" type="video/mp4" />
                    </video>
                    <p> Vous pouvez filtrez par date. </p>
                </div>
            `;
            break;
        case "helpConnexionArticle1":
            helpPopup.innerHTML = `
                <div class="popup-inner">
                    <div class="popup-title">
                        <p>Comment se connecter avec les questions de sécurité ?</p>
                        <label for="help-popup" class="round_btn transparent small close" onclick="closeHelpPopUp()"></label>
                    </div>
                    <video id="video" controls>
                        <source src="../video/Ezekiel.mp4" type="video/mp4" />
                    </video>
                    <p> Vous pouvez filtrez par date. </p>
                </div>
            `;
            break;
        default:
            helpPopup.innerHTML = `
                <div class="popup-inner">
                    <div class="popup-title">
                        <p>Pop-Up vide</p>
                        <label for="help-popup" class="round_btn transparent small close" onclick="closeHelpPopUp()"></label>
                    </div>
                </div>
            `;
            break;
    }
    
    openPopup("help-popup");

}

async function closeHelpPopUp(){
    let video = document.getElementById("video");
    video.pause();
    console.log(document.getElementById('help-popup').checked);
    closePopup('help-popup');
    console.log(document.getElementById('help-popup').checked);
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

