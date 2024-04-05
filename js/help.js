/**
 * Displays the content of the pop-up whose id is in parameter
 * @param {Number} id id of the pop-up that we want to unrolled (display its content)
 */
async function unrolle(id, e) {
    e.stopPropagation();

    let clickedElement= document.getElementById(id);
    if ( clickedElement.style.display == 'flex') {
        clickedElement.style.display = 'none';
    } else {
        clickedElement.style.display = 'flex';
    }
}

async function goToHelpPage(pageNumber, e){
    e.stopPropagation();

    window.location = "doc.pdf#page=" + pageNumber;
}

