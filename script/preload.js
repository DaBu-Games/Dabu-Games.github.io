

window.addEventListener('DOMContentLoaded', () => {
    const divs = document.querySelectorAll('.icons');
    const icons = document.querySelectorAll('.icon i');
    
    divs.forEach(div => {
        div.addEventListener('mouseenter', addTransiton)} 
    );

    function addTransiton(){
        icons.forEach(icon => {
            icon.classList.add('icon-transition'); // add transition
        });
        divs.forEach(div => {
            div.removeEventListener('mouseenter', addTransiton);
        });
    }
});