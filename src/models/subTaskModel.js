const mongoose = require('mongoose');

const subTaskSchema = new mongoose.Schema({
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    subTask: { type: String, required: true },
    completed: { type: Boolean, default: false } // New field

}, { timestamps: true });

module.exports = mongoose.model('SubTask', subTaskSchema);