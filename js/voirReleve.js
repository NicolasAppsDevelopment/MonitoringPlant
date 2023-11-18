document.addEventListener("DOMContentLoaded", () => {
    getCampagne();
});

async function getCampagne() {
    displayLoadingWithoutAnim("Récupération de la campagne...");

    const id = document.getElementById("id_campagne").value;

    let data = await PHP_post("/PHP_API/get_campaign.php", {
        "id": parseInt(id)
    });

    if (data != null){
        let campaignInfo = data["campaignInfo"];
        let mesurements = data["measurements"];

        console.log(data);
    }

    const titleCampaign = document.getElementById("titleCampaign");
    let title = 'scsd';
    titleCampaign.innerHTML = title;


    const tableContent = document.getElementById("tableContent");
    tableContent.innerHTML = title;
    

    hideLoading();
}