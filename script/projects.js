var projectData;

document.addEventListener('DOMContentLoaded', async () => {
    var projectContainer = document.getElementById('projects-container');

    try {
        const response = await fetch('script/projects.json');
        if (!response.ok) throw new Error('Failed to fetch JSON');
        projectData = await response.json();
    }
    catch (error) {
        console.error('Error loading projects JSON:', error);
    }

    fetch("../media/header/projects-cloud.svg")
        .then(res => res.text())
        .then(svg => {
            for (const project of projectData.projects) {
                
                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(svg, "image/svg+xml");
                const svgEl = svgDoc.documentElement;
                
                svgEl.getElementById("project-cloud-title").textContent = project.title;
                svgEl.getElementById("project-cloud-info").textContent = project.info;
                const img = svgEl.getElementById("project-cloud-image");
                
                img.setAttributeNS(
                    "http://www.w3.org/1999/xlink",
                    "href",
                    `../media/projects/${project.slug}/${project.img}`
                );

                svgEl.dataset.slug = project.slug;
                
                const col = document.createElement("div");
                col.className = "col-12 col-sm-6 col-md-4 p-4";

                col.appendChild(svgEl.cloneNode(true));
                
                projectContainer.appendChild(col);
            }


            SetClouds();
        });
})

function SetClouds(){
    let clouds = document.querySelectorAll("#project-cloud");
    
    clouds.forEach( cloud => {
        const cloudBorder = cloud.querySelector("#cloud-border");

        cloudBorder.style.stroke = "#E42548";

        cloudBorder.addEventListener("mouseenter", () => {
            cloudBorder.style.stroke = "white";
            cloudBorder.style.cursor = "pointer";
        });

        cloudBorder.addEventListener("mouseleave", () => {
            cloudBorder.style.stroke = "#E42548";
            cloudBorder.style.cursor = "default";
        });
        
        cloudBorder.addEventListener("click", () => {
            const slug = cloud.dataset.slug;
            window.location.href = `project.html?slug=${slug}`;
        })
    });
}