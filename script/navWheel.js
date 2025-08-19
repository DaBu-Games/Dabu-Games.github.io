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
let currentPage
let selectedPage;

document.addEventListener("DOMContentLoaded", () => {
    currentPage = document.body.dataset.page;
    const wheel = document.getElementById('nav-wheel');

    fetch("../media/wheel/wheel.svg")
        .then(res => res.text())
        .then(svg => {
            wheel.innerHTML = svg;
            hideWheel(true);

            arrow = document.getElementById('arrow');
            arrow.style.transformOrigin = '27px 27px';
            arrow.style.display = 'none';

            Object.keys(pages).forEach(id => {

                if(id === currentPage) {
                    let icon = document.getElementById(`${id}-icon`);
                    icon.style.fill = '#222222';
                    icon.style.stroke = '#E42548';
                    return;
                }
                
                const el = document.getElementById(id);
                const bg = document.getElementById(`${id}-bg`);
                if (el && bg) {
                    
                    //el.style.cursor = 'pointer'; // pointer on hover

                    el.addEventListener("pointerenter", (e) => {
                        activateItem(id, bg)
                    });
                    
                    el.addEventListener("pointerleave", (e) => {
                         deactivateItem(bg);
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
            
            let longPressTimeout;
            document.getElementById("hitbox").addEventListener("touchstart", (e) => {
                if (wheelOpenBy) return;
                hitbox.setPointerCapture(e.pointerId);
                
                longPressTimeout = setTimeout(() => { 
                    hideWheel(false);
                    wheelOpenBy = "touch";
                }, 500);
            });

            let oldEl = null;
            document.addEventListener("touchmove", (e) => {
                if (e.touches.length === 0) return;

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

                if (matchedId && matchedId !== oldEl && matchedId !== currentPage) {
                    if(oldEl) {
                        deactivateItem(document.getElementById(`${oldEl}-bg` ));
                    }
                    activateItem(matchedId, document.getElementById(`${matchedId}-bg` ));
                    oldEl = matchedId;
                }
                else if(oldEl !== matchedId && oldEl) {
                    deactivateItem(document.getElementById(`${oldEl}-bg` ));
                    oldEl = null;
                }
            });

            document.addEventListener("touchend", (e) => {
                clearTimeout(longPressTimeout);
                
                if(wheelOpenBy === "touch")
                {
                    goToNextPage();
                    if(oldEl) {
                        deactivateItem(document.getElementById(`${oldEl}-bg` ));
                    }
                    hideWheel(true);
                    wheelOpenBy = null;
                }

                hitbox.releasePointerCapture(e.pointerId);
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
    
    function activateItem(id, bg)
    {
        rotateArrow(angles[id]);
        bg.style.stroke = "#E42548";
        bg.style.strokeWidth = "0.5";
        selectedPage = id;

        if(arrow.style.display === "none")
        {
            arrow.style.display = "inline";
        }
    }
    
    function deactivateItem(bg)
    {
        bg.style.stroke = "#000000";
        bg.style.strokeWidth = "0.3";
        arrow.style.display = "none";

        selectedPage = '';
    }
    
    function goToNextPage()
    {
        if(selectedPage && selectedPage !== currentPage) {
            console.log(selectedPage);
            //window.location.href = pages[selectedPage];
        }
    }
});
