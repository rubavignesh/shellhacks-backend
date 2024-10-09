const Task = require('../models/taskModel');
const SubTask = require('../models/subTaskModel');
const aiService = require('../services/aiService');
const Note = require('../models/noteModel');

// Create a new Task
exports.createTask = async (req, res) => {
    const { task, noteId } = req.body;
    if (!task) {
        return res.status(400).json({ message: 'Task is required' });
    }
    try {
        const note = await Note.findById(noteId);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        const newTask = new Task({ task, noteId });
        await newTask.save();

        note.tasks.push(newTask);
        await note.save();
        res.status(201).json({ message: 'Task created', newTask });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Generate sub-tasks for a Task using AI/ML
exports.generateSubTasks = async (req, res) => {
    const { taskId } = req.body;
    if (!taskId) {
        return res.status(400).json({ message: 'Task ID is required to generate sub-tasks' });
    }
    try {
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        const subTasks = await aiService.aiGenerateSubTasks(task.task);
        const subTaskDocs = subTasks.map(subTask => ({ taskId, subTask }));
        const insertedSubTasks = await SubTask.insertMany(subTaskDocs);

        // Update the task with the generated sub-tasks
        task.subTasks.push(...insertedSubTasks);
        await task.save();

        res.json({ subTasks: insertedSubTasks });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get all Tasks for a user
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({  }).populate('subTasks');
        res.json({ tasks });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get all SubTasks for a Task
exports.getSubTasks = async (req, res) => {
    const { taskId } = req.params;
    try {
        const subTasks = await SubTask.find({ taskId });
        res.json({ subTasks });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
// Update Task by ID
exports.updateTaskById = async (req, res) => {
    const { id } = req.params;
    const { task, type, completed } = req.body; 
    try {
        const updatedTask = await Task.findByIdAndUpdate(id, { task, type }, { new: true });
        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json({ message: 'Task updated', updatedTask });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete Task by ID
exports.deleteTaskById = async (req, res) => {
    const { id } = req.params;
    try {
        const task = await Task.findByIdAndDelete(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        // Delete associated sub-tasks
        await SubTask.deleteMany({ taskId: id });
        res.json({ message: 'Task and associated sub-tasks deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.updateSubTaskById = async (req, res) => {
    const { id } = req.params;
    const { subTask, completed } = req.body; // Include completed
    try {
        const updatedSubTask = await SubTask.findByIdAndUpdate(id, { subTask, completed }, { new: true });
        if (!updatedSubTask) {
            return res.status(404).json({ message: 'SubTask not found' });
        }
        res.json({ message: 'SubTask updated', updatedSubTask });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete SubTask by ID
exports.deleteSubTaskById = async (req, res) => {
    const { id } = req.params;
    try {
        const subTask = await SubTask.findByIdAndDelete(id);
        if (!subTask) {
            return res.status(404).json({ message: 'SubTask not found' });
        }
        res.json({ message: 'SubTask deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};