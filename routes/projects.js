const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth');

// @route   GET /api/projects
// @desc    Get all projects
// @access  Public
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().sort({ order: 1, createdAt: -1 });
        res.json(projects);
    } catch (error) {
        console.error('Get projects error:', error);
        res.status(500).json({ error: 'Server error fetching projects' });
    }
});

// @route   GET /api/projects/:id
// @desc    Get single project
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json(project);
    } catch (error) {
        console.error('Get project error:', error);
        res.status(500).json({ error: 'Server error fetching project' });
    }
});

// @route   POST /api/projects
// @desc    Create new project
// @access  Protected
router.post('/', auth, async (req, res) => {
    try {
        const { title, description, image, techStack, projectUrl, githubUrl, featured, order } = req.body;

        const project = new Project({
            title,
            description,
            image,
            techStack,
            projectUrl,
            githubUrl,
            featured,
            order
        });

        await project.save();
        res.status(201).json({ message: 'Project created successfully', project });
    } catch (error) {
        console.error('Create project error:', error);
        res.status(500).json({ error: 'Server error creating project' });
    }
});

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Protected
router.put('/:id', auth, async (req, res) => {
    try {
        const { title, description, image, techStack, projectUrl, githubUrl, featured, order } = req.body;

        const project = await Project.findByIdAndUpdate(
            req.params.id,
            { title, description, image, techStack, projectUrl, githubUrl, featured, order },
            { new: true, runValidators: true }
        );

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.json({ message: 'Project updated successfully', project });
    } catch (error) {
        console.error('Update project error:', error);
        res.status(500).json({ error: 'Server error updating project' });
    }
});

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Protected
router.delete('/:id', auth, async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Delete project error:', error);
        res.status(500).json({ error: 'Server error deleting project' });
    }
});

module.exports = router;
