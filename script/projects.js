var projectData;

document.addEventListener('DOMContentLoaded', async () => {
    var projectContainer = document.getElementById('projects-container');

    try {
        const response = await fetch('script/projects.json');
        if (!response.ok) throw new Error('Failed to fetch JSON');
        projectData = await response.json();
    }
    catch (error) {
        console.error('Error loading timeline JSON:', error);
    }

    fetch("../media/projects-cloud.svg")
        .then(res => res.text())
        .then(svg => {
            for (const project of projectData.projects) {
                
                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(svg, "image/svg+xml");
                const svgEl = svgDoc.documentElement;
                
                svgEl.getElementById("project-cloud-title").textContent = project.title;
                svgEl.getElementById("project-cloud-info").textContent = project.info;
                const img = svgEl.getElementById("project-cloud-image");

                // IMPORTANT: SVG uses xlink:href
                img.setAttributeNS(
                    "http://www.w3.org/1999/xlink",
                    "href",
                    "../media/" + project.img
                );
                
                const col = document.createElement("div");
                col.className = "col-12 col-md-6 p-4";

                col.appendChild(svgEl.cloneNode(true));
                
                projectContainer.appendChild(col);
            }
        });
})