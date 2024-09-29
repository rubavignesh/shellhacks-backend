const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();
const taskRoutes = require('./routes/taskRoutes');
const jobRoutes = require('./routes/jobRoutes');
const userRoutes = require('./routes/userRoutes');
const noteRoutes = require('./routes/noteRoutes');
const connectDB = require('./config/db');
const cors = require('cors');
// Initialize database connection
connectDB();

const app = express();
app.use(bodyParser.json());
app.use(cors());
// Routes
app.use('/tasks', taskRoutes);
app.use('/jobs', jobRoutes);
app.use('/users', userRoutes);
app.use('/notes', noteRoutes);
module.exports = app;