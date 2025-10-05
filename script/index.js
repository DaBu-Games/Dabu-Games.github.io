
let stars;
let currentBreak = null;
let timelineData = null;

const breakPoints = {
    large : 990,
    medium: 576,
    small : 350,
};

function getCurrentBreakPoint() {
    const width = window.innerWidth;

    if (width > breakPoints.large) return "large";
    if (width > breakPoints.medium) return "medium";
    return "small";
}

function SetStars(){
    stars = document.querySelectorAll('[id$="-star"]');

    stars.forEach(star => {
        star.addEventListener('mouseenter', () => {
            const id = star.getAttribute("id");
            console.log("Hovered star:", id);
        });
    });
}

function LoadInSVG(size){
    fetch(`../media/treetimeline${size}.svg`)
        .then(res => res.text())
        .then(svg => {
            const timeLine = document.getElementById('tree-time-line');
            const oldSVG = timeLine.querySelector("svg");
            if (oldSVG) oldSVG.remove();

            // Create a DOM element from the SVG string
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svg, "image/svg+xml").documentElement;

            // Append new SVG
            timeLine.appendChild(svgDoc);
            SetStars(); 
        });
}

function checkAndLoadSVG() {
    const newBreak = getCurrentBreakPoint();

    // Only reload if breakpoint actually changed
    if (newBreak !== currentBreak) {
        currentBreak = newBreak;
        LoadInSVG(currentBreak);
    }
}

window.addEventListener("resize", () => {
    clearTimeout(window._svgResizeTimer);
    window._svgResizeTimer = setTimeout(checkAndLoadSVG, 200);
});

window.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('scripts/stars.json');
        if (!response.ok) throw new Error('Failed to fetch JSON');

        // Parse and store in global variable
        timelineData = await response.json();

        console.log('Timeline data loaded:', timelineData);
    } 
    catch (error) {
        console.error('Error loading timeline JSON:', error);
    }
    checkAndLoadSVG();

    const divs = document.querySelectorAll('.icons');
    const icons = document.querySelectorAll('.icon i');
    
    divs.forEach(div => {
        div.addEventListener('mouseenter', AddTransition)} 
    );

    function AddTransition(){
        icons.forEach(icon => {
            icon.classList.add('icon-transition'); // add transition
        });
        divs.forEach(div => {
            div.removeEventListener('mouseenter', AddTransition);
        });
    }
});