const Note = require('../models/noteModel');
const Task = require('../models/taskModel');

// Create a new Note
exports.createNote = async (req, res) => {
    const { title } = req.body;
    const userId = req.params.id;
    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }
    try {
        const newNote = new Note({ title, userId });
        await newNote.save();
        res.status(201).json({ message: 'Note created', newNote });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get all Notes
exports.getNotes = async (req, res) => {
    try {
        const notes = await Note.find({ }).populate('tasks');
        res.json({ notes });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.getNoteByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const notes = await Note.find({ userId: userId }).populate('tasks');
        if (!notes.length) {
            return res.status(404).json({ message: 'No notes found for this user' });
        }
        res.json({ notes });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get Note by ID
exports.getNoteById = async (req, res) => {
    const { id } = req.params;
    try {
        const note = await Note.findById(id).populate('tasks');
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json({ note });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update Note by ID
exports.updateNoteById = async (req, res) => {
    const { id } = req.params;
    const { title, description, tasks } = req.body;
    const userId = req.params.id;
    try {
        const note = await Note.findByIdAndUpdate(id, { title, description, tasks, userId }, { new: true });
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json({ message: 'Note updated', note });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.deleteNoteById = async (req, res) => {
    const { id } = req.params;
    try {
        const note = await Note.findByIdAndDelete(id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        await Task.deleteMany({ _id: { $in: note.tasks } });
        res.json({ message: 'Note and associated tasks deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
