const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    noteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Note', required: true },
    task: { type: String, required: true },
    type: { type: String }, 
    subTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubTask' }],
    completed: { type: Boolean, default: false } 
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);