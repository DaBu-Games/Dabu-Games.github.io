const angles = {
    home: 180,        // top
    projects: 90,  // left
    cv: 270,         // right
    contact: 0    // bottom
};

const pages = {
    home: "index.html",
    projects: "projects.html",
    cv: "cv.html",
    contact: "contact.html"
};

let arrow;
let infoText;
let currentPage
let selectedPage;
document.addEventListener("DOMContentLoaded", () => {
    currentPage = document.body.dataset.page;
    const wheel = document.getElementById('nav-wheel');
    const bodyFont = window.getComputedStyle(document.body).fontFamily;

    fetch("../media/wheel/wheel.svg")
        .then(res => res.text())
        .then(svg => {
            wheel.innerHTML = svg;
            hideWheel(true);

            arrow = document.getElementById('arrow');
            arrow.style.transformOrigin = '27px 27px';
            arrow.style.display = 'none';
            
            infoText = document.getElementById('info-text');
            infoText.style.fontFamily = bodyFont;
            infoText.innerHTML = '';

            Object.keys(pages).forEach(id => {

                if(id === currentPage) {
                    let icon = document.getElementById(`${id}-icon`);
                    let bg = document.getElementById(`${id}-bg`);
                    
                    icon.style.fill = '#222222';
                    bg.style.fill = '#222222';
                    icon.style.stroke = '#E42548';
                }
                
                const el = document.getElementById(id);
                if (el) {
                    el.addEventListener("pointerenter", (e) => {
                        activateItem(id)
                    });
                    
                    el.addEventListener("pointerleave", (e) => {
                         deactivateItem(id);
                    })
                }
            });
        });
    
    const button = document.getElementById('nav-button');
    let wheelOpenBy = null;
    
    fetch("../media/wheel/button.svg")
        .then(res => res.text())
        .then(svg => {
            
            button.innerHTML = svg;
            
            let buttonText = document.getElementById('button-text');
            buttonText.style.fontFamily = bodyFont;
            
            let longPressTimeout;
            let hitbox = document.getElementById('hitbox');
            
            hitbox.addEventListener('mouseenter', (e) => {
                if(!wheelOpenBy) {
                    button.style.opacity = 0.6;
                }
            });
            hitbox.addEventListener('mouseleave', (e) => {
                if(wheelOpenBy !== 'mouse' && wheelOpenBy !== 'touch') {
                    button.style.opacity = 0.25;
                }
            });
            
            hitbox.addEventListener("mousedown", (e) => {
                if (wheelOpenBy) return;
                button.style.opacity = 1;
                wheelOpenBy = 'mouse';

                longPressTimeout = setTimeout(() => {
                    hideWheel(false);
                }, 500);
            });

            document.addEventListener("mouseup", (e) => {
                clearTimeout(longPressTimeout);
                
                if(wheelOpenBy === 'mouse') 
                {
                    hideWheel(true);
                    goToNextPage();
                    wheelOpenBy = null;
                    button.style.opacity = 0.25;
                }
            });
            
            hitbox.addEventListener("touchstart", (e) => {
                if (wheelOpenBy) return;
                button.style.opacity = 1;
                wheelOpenBy = 'touch';
                
                longPressTimeout = setTimeout(() => { 
                    hideWheel(false);
                }, 500);
            });

            let oldEl = null;
            document.addEventListener("touchmove", (e) => {
                if (e.touches.length === 0 || wheelOpenBy !== 'touch') return;

                const touch = e.touches[0];
                const el = document.elementFromPoint(touch.clientX, touch.clientY);

                if (!el) return;

                const parentId = el.parentElement?.id;
                const baseId = el.id?.split("-")[0];

                let matchedId = null;

                if (pages.hasOwnProperty(baseId)) {
                    matchedId = baseId;
                } else if (pages.hasOwnProperty(parentId)) {
                    matchedId = parentId;
                }

                if (matchedId && matchedId !== oldEl) {
                    if(oldEl) {
                        deactivateItem(oldEl);
                    }
                    activateItem(matchedId);
                    oldEl = matchedId;
                }
                else if(oldEl !== matchedId && oldEl) {
                    deactivateItem(oldEl);
                    oldEl = null;
                }
            });

            document.addEventListener("touchend", (e) => {
                clearTimeout(longPressTimeout);
                
                if(wheelOpenBy === "touch")
                {
                    hideWheel(true);
                    goToNextPage();
                    if(oldEl) {
                        deactivateItem(oldEl);
                        oldEl = null;
                    }
                    wheelOpenBy = null;
                    button.style.opacity = 0.25;
                }
            });
        });

    function rotateArrow(targetAngle){
        arrow.style.transform = `rotate(${targetAngle}deg)`;
    }

    document.addEventListener("keydown", (e) => {
        if (e.key.toLowerCase() === "q"  && !wheelOpenBy) {
            hideWheel(false);
            wheelOpenBy = "key";
        }
    });

    document.addEventListener("keyup", (e) => {
        if (e.key.toLowerCase() === "q" && wheelOpenBy === "key") {
            hideWheel(true);
            goToNextPage();
            wheelOpenBy = null;
        }
    });
    
    function hideWheel(bool) {
        if (bool) {
            wheel.classList.remove("active");
        } else {
            wheel.classList.add("active");
        }
    }
    
    function activateItem(id)
    {
        let bg = document.getElementById(`${id}-bg`);
        
        if(id !== currentPage) 
        {
            bg.style.stroke = "#E42548";
            bg.style.strokeWidth = "0.5";
            selectedPage = id;
        }
        
        rotateArrow(angles[id]);
        
        infoText.innerHTML = `${id}`;

        if(arrow.style.display === "none")
        {
            arrow.style.display = "inline";
        }
    }
    
    function deactivateItem(id)
    {
        let bg = document.getElementById(`${id}-bg`);
        
        bg.style.stroke = "#000000";
        bg.style.strokeWidth = "0.3";
        arrow.style.display = "none";
        
        selectedPage = '';
        infoText.innerHTML = '';
    }
    
    function goToNextPage()
    {
        if(selectedPage && selectedPage !== currentPage) {
            console.log(selectedPage);
            //window.location.href = pages[selectedPage];
        }

        selectedPage = '';  
    }
});
