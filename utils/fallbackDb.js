const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, '..', 'fallback_data.json');

const INITIAL_FALLBACK_DATA = {
    about: {
        bio: "Welcome to my portfolio! I'm M SAAD SHAIKH, a passionate developer creating amazing digital experiences.",
        profileImage: '/uploads/profile.jpg',
        socialLinks: {
            github: 'https://github.com',
            linkedin: 'https://linkedin.com',
            twitter: '',
            email: 'msaadshaikh@example.com',
            instagram: '',
            whatsapp: ''
        },
        experience: {
            years: '3+',
            label: 'Years of building real-world projects'
        },
        education: [
            {
                degree: 'Bachelor of Science in Computer Science',
                institution: 'University',
                year: '2022 - 2026',
                icon: 'fas fa-graduation-cap'
            }
        ],
        certifications: [
            {
                name: 'Full Stack Web Development Certificate',
                issuer: 'Udemy',
                icon: 'fas fa-certificate'
            }
        ],
        stats: {
            completed: '15+'
        }
    },
    skills: [
        { _id: 'fallback-skill-1', name: 'HTML5/CSS3', category: 'Frontend', proficiency: 95, icon: '🎨', order: 1 },
        { _id: 'fallback-skill-2', name: 'JavaScript', category: 'Frontend', proficiency: 90, icon: '🎨', order: 2 },
        { _id: 'fallback-skill-3', name: 'React.js', category: 'Frontend', proficiency: 85, icon: '🎨', order: 3 },
        { _id: 'fallback-skill-4', name: 'Node.js', category: 'Backend', proficiency: 88, icon: '⚙️', order: 1 },
        { _id: 'fallback-skill-5', name: 'Express.js', category: 'Backend', proficiency: 85, icon: '⚙️', order: 2 },
        { _id: 'fallback-skill-6', name: 'MongoDB', category: 'Database', proficiency: 80, icon: '🗄️', order: 1 },
        { _id: 'fallback-skill-7', name: 'PostgreSQL', category: 'Database', proficiency: 75, icon: '🗄️', order: 2 },
        { _id: 'fallback-skill-8', name: 'Docker', category: 'DevOps', proficiency: 70, icon: '🐳', order: 1 },
        { _id: 'fallback-skill-9', name: 'Git & GitHub', category: 'Tools', proficiency: 90, icon: '🛠️', order: 1 }
    ],
    projects: [
        {
            _id: 'fallback-proj-1',
            title: 'Premium E-Commerce Experience',
            description: 'A dark futuristic storefront with Stripe integrations, real-time inventory management, and custom glassmorphic aesthetics.',
            image: '/uploads/default-project.jpg',
            techStack: ['React', 'Node.js', 'MongoDB', 'Stripe'],
            projectUrl: 'https://github.com',
            githubUrl: 'https://github.com',
            featured: true,
            order: 1
        },
        {
            _id: 'fallback-proj-2',
            title: 'Futuristic Portfolio Platform',
            description: 'An ultra-premium, interactive developer portfolio featuring GPU-accelerated cursor effects, bento grids, and high-performance layout rendering.',
            image: '/uploads/default-project.jpg',
            techStack: ['HTML5', 'Vanilla CSS', 'JavaScript', 'GSAP'],
            projectUrl: 'https://github.com',
            githubUrl: 'https://github.com',
            featured: false,
            order: 2
        },
        {
            _id: 'fallback-proj-3',
            title: 'AI Prompt Engineering Tool',
            description: 'A dashboard application for testing and evaluating LLM outputs with semantic caching and robust security headers.',
            image: '/uploads/default-project.jpg',
            techStack: ['Node.js', 'Express', 'OpenAI API', 'TailwindCSS'],
            projectUrl: 'https://github.com',
            githubUrl: 'https://github.com',
            featured: false,
            order: 3
        }
    ]
};

function readData() {
    try {
        if (!fs.existsSync(FILE_PATH)) {
            writeData(INITIAL_FALLBACK_DATA);
            return INITIAL_FALLBACK_DATA;
        }
        const content = fs.readFileSync(FILE_PATH, 'utf8');
        return JSON.parse(content);
    } catch (err) {
        console.error('Error reading local fallback database file:', err.message);
        return INITIAL_FALLBACK_DATA;
    }
}

function writeData(data) {
    try {
        fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 4), 'utf8');
    } catch (err) {
        console.error('Error writing to local fallback database file:', err.message);
    }
}

module.exports = {
    getAbout() {
        return readData().about;
    },
    saveAbout(aboutData) {
        const data = readData();
        data.about = aboutData;
        writeData(data);
        return data.about;
    },
    getSkills() {
        return readData().skills;
    },
    addSkill(skill) {
        const data = readData();
        if (!skill._id) {
            skill._id = 'fallback-skill-' + Date.now();
        }
        data.skills.push(skill);
        writeData(data);
        return skill;
    },
    updateSkill(id, updatedSkill) {
        const data = readData();
        const index = data.skills.findIndex(s => s._id === id);
        if (index !== -1) {
            data.skills[index] = { ...data.skills[index], ...updatedSkill, _id: id };
            writeData(data);
            return data.skills[index];
        }
        return null;
    },
    deleteSkill(id) {
        const data = readData();
        data.skills = data.skills.filter(s => s._id !== id);
        writeData(data);
        return true;
    },
    getProjects() {
        return readData().projects;
    },
    addProject(project) {
        const data = readData();
        if (!project._id) {
            project._id = 'fallback-proj-' + Date.now();
        }
        data.projects.push(project);
        writeData(data);
        return project;
    },
    updateProject(id, updatedProject) {
        const data = readData();
        const index = data.projects.findIndex(p => p._id === id);
        if (index !== -1) {
            data.projects[index] = { ...data.projects[index], ...updatedProject, _id: id };
            writeData(data);
            return data.projects[index];
        }
        return null;
    },
    deleteProject(id) {
        const data = readData();
        data.projects = data.projects.filter(p => p._id !== id);
        writeData(data);
        return true;
    }
};
