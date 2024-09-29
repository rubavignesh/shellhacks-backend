const Job = require('../models/jobModel');
const aiService = require('../services/aiService');

exports.searchJobs = async (req, res) => {
    const { jobTitle, postingTime, location, experienceLevel } = req.body;
    if (!jobTitle && !postingTime && !location && !experienceLevel) {
        return res.status(400).json({ message: 'At least one search parameter is required' });
    }
    try {
        // Generate LinkedIn boolean search URL
        console.log("Generating LinkedIn Link...");
        const linkedInLink = await aiService.aiGenerateBooleanLink(jobTitle, postingTime, location, experienceLevel);
        console.log("LinkedIn Link:", linkedInLink);
        // res.json({ linkedInLink });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error});
    }
};

// Create a new job entry
exports.addJob = async (req, res) => {
    try {
        const job = new Job(req.body);
        await job.save();
        res.status(201).json(job);
    } catch (error) {
        res.status(400).json({ message: 'Error adding job', error });
    }
};

// Get all job entries
exports.getJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ userId: req.user._id });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching jobs', error });
    }
};

// Get a single job entry by ID
exports.getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.json(job);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching job', error });
    }
};

// Update a job entry by ID
exports.updateJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.json(job);
    } catch (error) {
        res.status(400).json({ message: 'Error updating job', error });
    }
};

// Delete a job entry by ID
exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting job', error });
    }
};
