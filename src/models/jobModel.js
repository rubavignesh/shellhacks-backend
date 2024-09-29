const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    jobTitle: { type: String, required: true },
    companyName: { type: String, required: true },
    location: { type: String },
    experienceLevel: { type: String },
    applied: { type: Boolean, default: false },
    applicationStatus: { type: String, enum: ['Applied', 'Interview', 'Offer', 'Rejected'], default: 'Applied' }, // New field
    notes: { type: String }, // New field
    followUpDate: { type: Date } // New field
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);