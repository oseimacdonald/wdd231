// course.js - Load course information dynamically for WDD231
document.addEventListener('DOMContentLoaded', () => {
    const projectList = document.querySelector('.project-list');
    const courseList = document.querySelector('.course-list');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const totalCreditsElement = document.getElementById('totalCredits');
    
    // Project data for WDD231
    const projects = [
        { 
            name: 'Chamber of Commerce', 
            description: 'A website for a local chamber of commerce, showcasing local businesses, events, and community information using responsive design principles.', 
            link: 'chamber.html',
            skills: ['HTML', 'CSS', 'JavaScript', 'Responsive Design']
        },
        { 
            name: 'Final Project', 
            description: 'A comprehensive web application demonstrating mastery of frontend development concepts learned throughout the course.', 
            link: 'final.html',
            skills: ['React', 'API Integration', 'State Management']
        }
    ];
    
    // Course data for Web and Computer Programming Certificate
    const courses = [
        { code: 'CSE110', name: 'Programming Building Blocks', credits: 2, completed: true },
        { code: 'WDD130', name: 'Web Fundamentals', credits: 2, completed: true },
        { code: 'CSE111', name: 'Programming with Functions', credits: 2, completed: false },
        { code: 'CSE210', name: 'Programming with Classes', credits: 2, completed: false },
        { code: 'WDD131', name: 'Dynamic Web Fundamentals', credits: 2, completed: true },
        { code: 'WDD231', name: 'Frontend Web Development II', credits: 3, completed: false },
        { code: 'CSE121B', name: 'JavaScript Language', credits: 2, completed: true },
        { code: 'CSE211', name: 'Programming with Data Structures', credits: 2, completed: false }
    ];
    
    // Populate projects
    projects.forEach(project => {
        const projectElement = document.createElement('div');
        projectElement.classList.add('project-item');
        
        const skillsHTML = project.skills.map(skill => 
            `<span class="skill-pill">${skill}</span>`
        ).join('');
        
        projectElement.innerHTML = `
            <h3><a href="${project.link}">${project.name}</a></h3>
            <p>${project.description}</p>
            <div class="skills">${skillsHTML}</div>
        `;
        projectList.appendChild(projectElement);
    });
    
    // Function to render courses based on filter
    function renderCourses(filter = 'all') {
        courseList.innerHTML = '';
        let filteredCourses = courses;
        
        if (filter === 'wdd') {
            filteredCourses = courses.filter(course => course.code.startsWith('WDD'));
        } else if (filter === 'cse') {
            filteredCourses = courses.filter(course => course.code.startsWith('CSE'));
        }
        
        // Calculate total credits
        const totalCredits = filteredCourses.reduce((total, course) => total + course.credits, 0);
        totalCreditsElement.textContent = totalCredits;
        
        // Render courses
        filteredCourses.forEach(course => {
            const courseElement = document.createElement('div');
            courseElement.classList.add('course-item');
            
            if (course.completed) {
                courseElement.style.backgroundColor = '#f0fff4';
                courseElement.style.borderLeftColor = '#2f855a';
            }
            
            courseElement.innerHTML = `
                <h3>${course.code}</h3>
                <p><strong>${course.name}</strong> (${course.credits} credits)</p>
                <span class="status ${course.completed ? 'completed' : 'planned'}">
                    ${course.completed ? 'Completed' : 'Planned'}
                </span>
            `;
            courseList.appendChild(courseElement);
        });
    }
    
    // Initial render
    renderCourses();
    
    // Add event listeners to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            button.classList.add('active');
            button.setAttribute('aria-pressed', 'true');
            renderCourses(button.dataset.filter);
        });
    });
});
