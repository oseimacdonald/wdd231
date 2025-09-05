// course.js - Load course information dynamically for WDD231
document.addEventListener('DOMContentLoaded', () => {
    const projectList = document.querySelector('.project-list');
    const courseList = document.querySelector('.course-list');
    
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
    
    // Course data with your specific courses
    const courses = [
        { 
            code: 'WDD231', 
            name: 'Web Frontend Development II', 
            description: 'Advanced frontend development techniques including responsive design, APIs, and modern JavaScript frameworks.',
            credits: 3,
            status: 'In Progress',
            instructor: 'Professor Smith'
        },
        { 
            code: 'BUS301', 
            name: 'Business Communications', 
            description: 'Development of professional communication skills for business environments.',
            credits: 3,
            status: 'Completed',
            grade: 'B+'
        },
        { 
            code: 'CSE340', 
            name: 'Web Backend Development', 
            description: 'Server-side programming, databases, and backend technologies for web applications.',
            credits: 3,
            status: 'Completed',
            grade: 'A-'
        },
        { 
            code: 'REL200A', 
            name: 'Foundations of Religion', 
            description: 'Study of religious traditions and their foundational principles.',
            credits: 2,
            status: 'Completed',
            grade: 'A'
        },
        { 
            code: 'CSE212', 
            name: 'Programming with Data Structures', 
            description: 'Advanced programming concepts focusing on data structures and algorithms.',
            credits: 3,
            status: 'Completed',
            grade: 'B'
        },
        { 
            code: 'CSE270', 
            name: 'Introduction to Cybersecurity', 
            description: 'Fundamentals of cybersecurity principles, threats, and defense mechanisms.',
            credits: 3,
            status: 'Completed',
            grade: 'A-'
        },
        { 
            code: 'GESCI110', 
            name: 'Earth Science', 
            description: 'Study of Earth\'s systems, processes, and environmental interactions.',
            credits: 3,
            status: 'Completed',
            grade: 'B+'
        },
        { 
            code: 'HUM110', 
            name: 'Introduction to Humanities', 
            description: 'Exploration of human cultural achievements in art, literature, and philosophy.',
            credits: 3,
            status: 'Completed',
            grade: 'A'
        },
        { 
            code: 'REL225A', 
            name: 'New Testament Survey', 
            description: 'Comprehensive study of the New Testament scriptures and their historical context.',
            credits: 2,
            status: 'Completed',
            grade: 'A'
        },
        { 
            code: 'REL225B', 
            name: 'Old Testament Survey', 
            description: 'Comprehensive study of the Old Testament scriptures and their historical context.',
            credits: 2,
            status: 'Completed',
            grade: 'A-'
        }
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
    
    // Populate courses
    courses.forEach(course => {
        const courseElement = document.createElement('div');
        courseElement.classList.add('course-item');
        
        let statusHTML = '';
        if (course.status === 'Completed') {
            statusHTML = `<span class="status completed">Completed (Grade: ${course.grade})</span>`;
        } else if (course.status === 'In Progress') {
            statusHTML = `<span class="status in-progress">In Progress - Instructor: ${course.instructor}</span>`;
        } else {
            statusHTML = `<span class="status planned">Planned</span>`;
        }
        
        courseElement.innerHTML = `
            <h3>${course.code}</h3>
            <p><strong>${course.name}</strong> (${course.credits} credits)</p>
            <p>${course.description}</p>
            ${statusHTML}
        `;
        courseList.appendChild(courseElement);
    });
});
