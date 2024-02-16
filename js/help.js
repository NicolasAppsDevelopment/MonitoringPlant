async function deroule(id) {
    let clickedElement= document.getElementById(id);

    if ( clickedElement.style.display == 'flex')
    clickedElement.style.display = 'none';
    else clickedElement.style.display = 'flex';

}