
let stars;
let currentBreak = null;
let timelineData = null;

let maxWidth = null;
let cloud = null;
let cloudText = null;
let cloudScale = null;


const breakPoints = {
    large : 990,
    medium: 450,
    small : 350,
};

function getCurrentBreakPoint() {
    const width = window.innerWidth;

    if (width > breakPoints.large) return "large";
    if (width > breakPoints.medium) return "medium";
    return "small";
}

function SetTextBox()
{
    let bbox = cloud.getBBox();
    maxWidth = bbox.width * 0.7;
    const fontSize = Math.min(bbox.width, bbox.height) * 0.065;

    cloudText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    cloudText.setAttribute("id", "cloud-text");
    cloudText.setAttribute("x", bbox.x + bbox.width / 2);
    cloudText.setAttribute("y", bbox.y + bbox.height / 2);
    cloudText.setAttribute("text-anchor", "middle");
    cloudText.setAttribute("dominant-baseline", "middle");
    cloudText.setAttribute("fill", "black");
    cloudText.setAttribute("stroke", "none");
    cloudText.setAttribute("font-size", fontSize);

    document.getElementById("text-cloud").appendChild(cloudText);
}

function SetStars(){
    stars = document.querySelectorAll('[id$="-star"]');

    stars.forEach(star => {
        const firstPath = star.querySelector('path');
        const text = star.querySelectorAll('tspan')
        
        for (let i = 0; i < text.length; i++) {
            text[i].setAttribute("text-decoration", "underline");
        }
        
        star.addEventListener('mouseenter', (event) => {
            const id = star.getAttribute("id");
            const starData = timelineData.stars.find(item => item.id === id.substring(0, id.lastIndexOf("-")));
            WrapText(starData.description);
            SetCloudPosition(star);
            firstPath.style.fill = '#E42548';
        });
        star.addEventListener('mouseleave', () => {
            cloud.setAttribute("opacity", "0");
            firstPath.style.fill = '#01c5c5';
        })
    });
}

function WrapText(text) {
    if (!cloudText) return;

    while (cloudText.firstChild) cloudText.removeChild(cloudText.firstChild);

    const words = text.split(" ");
    const lines = [];
    let line = "";

    // temporary tspan to measure width
    const testTspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
    cloudText.appendChild(testTspan);

    for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + " ";
        testTspan.textContent = testLine;
        const testWidth = testTspan.getComputedTextLength();

        if (testWidth > maxWidth && line !== "") {
            lines.push(line.trim());
            line = words[i] + " ";
        } else {
            line = testLine;
        }
    }
    if (line) lines.push(line.trim());

    cloudText.removeChild(testTspan);

    const fontSize = parseFloat(cloudText.getAttribute("font-size"));
    const lineHeight = fontSize * 1.2; // px
    const totalHeight = lines.length * lineHeight;

    lines.forEach((lineText, i) => {
        const tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
        tspan.setAttribute("x", cloudText.getAttribute("x"));
        if (i === 0) {
            // offset first line up by half total height
            tspan.setAttribute("dy", `-${totalHeight/2 - lineHeight/2}px`);
        } else {
            tspan.setAttribute("dy", `${lineHeight}px`);
        }
        tspan.textContent = lineText;
        cloudText.appendChild(tspan);
    });
}

function LoadInSVG(size){
    fetch(`../media/timeline/treetimeline${size}.svg`)
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

            LoadCloudSVG(svgDoc);
        });
}

function CheckAndLoadSVG() {
    const newBreak = getCurrentBreakPoint();
    
    if (newBreak !== currentBreak) {
        currentBreak = newBreak;
        LoadInSVG(currentBreak);
    }
}

function SetCloudPosition(star) {
    const svg = document.querySelector('#tree-time-line svg');
    const starRect = star.getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();

    const svgPoint = svg.createSVGPoint();
    svgPoint.x = starRect.left + starRect.width / 2;
    svgPoint.y = starRect.top + starRect.height / 2;
    const starInSvg = svgPoint.matrixTransform(svg.getScreenCTM().inverse());

    const svgWidth = svg.viewBox.baseVal.width || svgRect.width;
    const svgHeight = svg.viewBox.baseVal.height || svgRect.height;

    let tx = svgWidth / 2;
    let ty = svgHeight / 2;

    if (window.innerWidth < breakPoints.medium) {
        ty = starInSvg.y > svgHeight / 2 ? svgHeight * 0.2 : svgHeight * 0.8;
    } else {
        tx = starInSvg.x > svgWidth / 2 ? svgWidth * 0.275 : svgWidth * 0.725;
    }
    
    const cloudBBox = cloud.getBBox();
    const cx = cloudBBox.x + cloudBBox.width / 2;
    const cy = cloudBBox.y + cloudBBox.height / 2;
    
    let fromRight;
    if (window.innerWidth < breakPoints.medium) {
        fromRight = starInSvg.y < svgHeight / 2;
    } else {
        fromRight = starInSvg.x < svgWidth / 2;
    }
    
    const startX = fromRight ? svgWidth + cloudBBox.width : -cloudBBox.width;
    const startY = ty;

    cloud.style.transition = 'none';
    cloud.setAttribute(
        "transform",
        `translate(${startX}, ${startY}) scale(${cloudScale}) translate(${-cx}, ${-cy})`
    );
    cloud.setAttribute("opacity", "0");
    
    cloud.getBoundingClientRect();
    
    cloud.style.transition = 'transform 0.8s ease, opacity 0.5s ease';
    cloud.setAttribute(
        "transform",
        `translate(${tx}, ${ty}) scale(${cloudScale}) translate(${-cx}, ${-cy})`
    );
    cloud.setAttribute("opacity", "1");
}

function LoadCloudSVG(timelineSVG) {
    fetch(`../media/header/cloud.svg`)
        .then(res => res.text())
        .then(svg => {
            const parser = new DOMParser();
            const cloudDoc = parser.parseFromString(svg, "image/svg+xml").documentElement;

            // Wrap the cloud in a <g> so we can transform easily
            const cloudGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
            cloudGroup.setAttribute("id", "text-cloud");
            cloudGroup.setAttribute("opacity", "0");
            cloudGroup.setAttribute("pointer-events", "none");

            while (cloudDoc.firstChild) {
                cloudGroup.appendChild(cloudDoc.firstChild);
            }

            // Append cloud into the timeline SVG directly
            timelineSVG.appendChild(cloudGroup);
            cloud = cloudGroup;

            const svgWidth = timelineSVG.viewBox.baseVal.width || timelineSVG.getBoundingClientRect().width;
            const scaleFactor = window.innerWidth < breakPoints.medium ? 0.9 : 0.5;
            const cloudBBox = cloud.getBBox();
            cloudScale = (svgWidth * scaleFactor) / cloudBBox.width;

            // set transform origin at cloud center
            const cx = cloudBBox.x + cloudBBox.width / 2;
            const cy = cloudBBox.y + cloudBBox.height / 2;
            cloud.setAttribute("transform", `translate(${cx}, ${cy}) scale(${cloudScale}) translate(${-cx}, ${-cy})`);


            // Add text box
            SetTextBox();

            SetStars();
        });
}

window.addEventListener("resize", () => {
    clearTimeout(window._svgResizeTimer);
    window._svgResizeTimer = setTimeout(CheckAndLoadSVG, 200);
});

window.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('script/stars.json');
        if (!response.ok) throw new Error('Failed to fetch JSON');
        timelineData = await response.json();

        //console.log('Timeline data loaded:', timelineData);
    } 
    catch (error) {
        console.error('Error loading timeline JSON:', error);
    }
    CheckAndLoadSVG();

    if(sessionStorage.getItem('scrollToContact') === 'true') {
        const contactSection = document.getElementById('contact-container');
        if(contactSection){
            setTimeout(() => {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
        // Remove the flag so it doesn’t scroll next time
        sessionStorage.removeItem('scrollToContact');
    }
});