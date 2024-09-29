const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } 
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);