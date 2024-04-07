/**
 * Displays the content of the container whose id is in parameter
 * @param {Number} id id of the container that we want to unrolled (display its content)
 * @param {Event} e event when the users press the button
 */
async function unroll(id, e) {
    e.stopPropagation();

    let clickedElement= document.getElementById(id);
    if ( clickedElement.style.display == 'flex') {
        clickedElement.style.display = 'none';
    } else {
        clickedElement.style.display = 'flex';
    }
}

/**
 * Redirects the user to the page of the documentation whose number is in parameter
 * @param {Number} pageNumber number of the page of the documentation that we want to display
 * @param {Event} e event when the user clicks on the button
 */
async function goToHelpPage(pageNumber, e){
    e.stopPropagation();
    window.open('docViewer/web/viewer.html#page=' + pageNumber, '_blank');
}

/**
 * Displays the right help panel when the user clicks on a topic according to the id of the panel
 * @param {number} panelId id of the panel that we want to display
 */
async function showHelpPanel(panelId) {
    let currentTopicsBtn = document.querySelector('.tablelist-item-btn.active');
    currentTopicsBtn.classList.remove('active');
    let currentPanel = document.querySelector('.tab-pane.active');
    currentPanel.classList.remove('active');

    let panel = document.getElementById(panelId);
    let topicsBtn = document.getElementById('btn-' + panelId);
    panel.classList.add('active');
    topicsBtn.classList.add('active');
}