
/**
 * Displays the content of the pop-up whose id is in parameter
 * @param {Number} id id of the pop-up that we want to unrolled (display its content)
 */
async function unrolle(id) {
    event.stopPropagation();

    let clickedElement= document.getElementById(id);
    if ( clickedElement.style.display == 'flex') {
        clickedElement.style.display = 'none';
    } else {
        clickedElement.style.display = 'flex';
    }
}

/**
 * Redirects the user to the manual on the page whose number is in parameter
 * @param {*} pageNumber manual page number
 */
async function goToHelpPage(pageNumber){
    event.stopPropagation();

    window.location = "doc.pdf#page=" + pageNumber;
}

