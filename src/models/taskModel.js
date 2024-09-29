const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    task: { type: String, required: true },
    type: { type: String, required: true }, 
    subTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubTask' }],
    completed: { type: Boolean, default: false } 
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);