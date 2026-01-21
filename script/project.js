document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("slug");

    try {
        const response = await fetch('script/projects.json');
        if (!response.ok) throw new Error('Failed to fetch JSON');
        const projectData = await response.json();
        const project = projectData.projects.find(p => p.slug === slug);

        if (!project) {
            console.error('Project not found');
            return;
        }

        document.getElementById('project-title').textContent = project.title;
        document.getElementById('project-info').textContent = project.info;
        document.getElementById('project-img').src = "../media/" + project.img;
        
        const page = await fetch(`projects/${project.slug}.html`);
        if (!page.ok) throw new Error('Failed to fetch JSON');
        
        const html = await page.text();
        document.getElementById('project-content').innerHTML = html;
    }
    catch (error) {
        console.error('Error loading projects JSON:', error);
    }
});