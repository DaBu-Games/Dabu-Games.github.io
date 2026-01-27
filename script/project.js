document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("slug");

    try {
        const response = await fetch('script/projects.json');
        if (!response.ok) throw new Error('Failed to fetch JSON');
        const projectData = await response.json();
        let project = projectData.projects.find(p => p.slug === slug);

        if (!project) {
            project = projectData.projects[0];
        }

        document.getElementById('project-title').textContent = project.title;
        document.getElementById('project-info').textContent = project.info;
        document.getElementById('project-img').src = `../media/projects/${project.slug}/${project.img}`;
        document.getElementById('time-frame').innerHTML = project.timeframe;
        document.getElementById('project-year').innerHTML = project.year;
        document.getElementById('project-team').innerHTML = project.team;
        

        document.getElementById('github-url').href = project.github;
        
        let github = project.github;
        github = github.substring(github.lastIndexOf('/') + 1);
        document.getElementById('github-text').innerHTML = "DaBu-Games/" + github;

        document.getElementById('itchio-url').href = project.itchio;
        
        let itch = project.itchio;
        itch = itch.substring(itch.lastIndexOf('/') + 1);
        document.getElementById('itchio-text').innerHTML = "itch.io/" + itch;
        
        const page = await fetch(`projects/${project.slug}.html`);
        if (!page.ok) throw new Error('Failed to fetch JSON');
        
        const html = await page.text();
        document.getElementById('project-content').innerHTML = html;

        SetArrow();
    }
    catch (error) {
        console.error('Error loading projects JSON:', error);
    }
});


function SetArrow() {
    fetch("../media/projects/back-arrow.svg")
        .then(res => res.text())
        .then(svg => {
            
            let arrowBox = document.getElementById("back-arrow-box");
            arrowBox.innerHTML = svg;
            
            let arrow = document.getElementById("back-arrow");

            arrowBox.addEventListener("mouseenter", () => {
                arrowBox.style.cursor = "pointer";
                arrow.style.fill = "white";
            })

            arrowBox.addEventListener("mouseleave", () => {
                arrowBox.style.cursor = "none";
                arrow.style.fill = "#E42548";
            })

            arrowBox.addEventListener("click", () => {
                window.location.href = "projects.html";
            })
        });
}