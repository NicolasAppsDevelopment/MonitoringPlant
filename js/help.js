async function deroule(id) {
    event.stopPropagation();

    let clickedElement= document.getElementById(id);
    if ( clickedElement.style.display == 'flex') {
        clickedElement.style.display = 'none';
    } else {
        clickedElement.style.display = 'flex';
    }
}

async function goToHelpPage(pageNumber){
    event.stopPropagation();

    window.location = "doc.pdf#page=" + pageNumber;
}

