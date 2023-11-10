async function getCampagnes() {
    let data = get("/campagnes");

    if (data != null){
        // traitement
    }

    document.getElementById("loading_div").remove();
}

document.addEventListener("DOMContentLoaded", () => {
    getCampagnes();
});