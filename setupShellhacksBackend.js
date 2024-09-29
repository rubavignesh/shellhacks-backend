const fs = require('fs');
const path = require('path');

const files = [
  {
    path: 'src/controllers/taskController.js',
    content: `const Task = require('../models/taskModel');
const SubTask = require('../models/subTaskModel');
const aiService = require('../services/aiService');

// Create a new Task
exports.createTask = async (req, res) => {
    const { task, type } = req.body;
    const userId = "66f86aedac76f19d65d23d02";
    if (!task || !type) {
        return res.status(400).json({ message: 'Task and type are required' });
    }
    try {
        const newTask = new Task({ task, type, userId });
        await newTask.save();
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
        task.subTasks.push(...insertedSubTasks.map(subTask => subTask._id));
        await task.save();

        res.json({ subTasks: insertedSubTasks });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get all Tasks for a user
exports.getTasks = async (req, res) => {
    const userId = "66f86aedac76f19d65d23d02";
    try {
        const tasks = await Task.find({ userId }).populate('subTasks');
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
};`
  },
  {
    path: 'src/models/taskModel.js',
    content: `const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    task: { type: String, required: true },
    type: { type: String, required: true }, 
    subTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubTask' }]
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);`
  },
  {
    path: 'src/routes/taskRoutes.js',
    content: `const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Routes for Task management
router.post('/create', taskController.createTask);
router.post('/generate-subtasks', taskController.generateSubTasks);
router.get('/', taskController.getTasks);
router.get('/:taskId/subtasks', taskController.getSubTasks);

module.exports = router;`
  },
  {
    path: 'src/app.js',
    content: `const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();
const taskRoutes = require('./routes/taskRoutes');
const jobRoutes = require('./routes/jobRoutes');
const userRoutes = require('./routes/userRoutes');
const connectDB = require('./config/db');

// Initialize database connection
connectDB();

const app = express();
app.use(bodyParser.json());

// Routes
app.use('/tasks', taskRoutes);
app.use('/jobs', jobRoutes);
app.use('/users', userRoutes);

module.exports = app;`
  },
  {
    path: 'src/services/aiService.js',
    content: `const { modelOutput } = require('./claudeRequest');

// Generate sub-tasks using AI/ML logic
const aiGenerateSubTasks = async (task) => {
    const prompt = \`You are an AI assistant tasked with generating sub-tasks based on the main task provided. The user's main task is: \${task}

Your role is to break down this main task into smaller, manageable sub-tasks that are actionable and help the user complete the main task efficiently.

In your response:
1. Identify key steps required to complete the main task.
2. Break each step down into specific sub-tasks that are clear, actionable, and logically ordered.
3. Make sure the sub-tasks are simple enough to be completed independently, but together lead to the completion of the main task.
4. The sub-tasks should not contain more than 5 words.
5. Number of sub-tasks generated should be a maximum of 4.
6. The sub-tasks should have specific tasks based on the problem that is specified. ex. Prepare for DSA should return me with subtasks related to DSA.
7. The prompt response must strictly contain only bullet points in the form of a string array (JSON).

Your sub-tasks should be concise, easy to follow, and should assist the user in making progress on the main task. Avoid over-complicating or adding unnecessary details.

Here’s an example of how the sub-task breakdown should look:

Main Task: "Organize a team meeting to discuss project milestones."

Sub-tasks:
1. Define the purpose and goals of the meeting.
2. Identify key participants and create a list of attendees.
3. Choose a meeting date and time that works for everyone.
4. Book a meeting room or set up a virtual meeting link.
5. Prepare an agenda outlining key discussion points.
6. Send out meeting invitations with the agenda attached.
7. Follow up with participants to ensure they are prepared.

Now, based on the provided main task, please generate the sub-tasks needed to complete it.

Main Task: \${task}\`;

    try {
        let subTasks = await modelOutput(prompt);
        subTasks = JSON.parse(subTasks);
        console.log(subTasks);
        return subTasks;
    } catch (error) {
        console.error('Error generating sub-tasks:', error);
        throw error;
    }
};

module.exports = { aiGenerateSubTasks };`
  },
  {
    path: 'src/models/subTaskModel.js',
    content: `const mongoose = require('mongoose');

const subTaskSchema = new mongoose.Schema({
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    subTask: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('SubTask', subTaskSchema);`
  },
  {
    path: 'server.js',
    content: `const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const app = require('./src/app');
const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('new-task', async (data) => {
        console.log('New Task:', data);
        try {
            // Generate sub-tasks using AI/ML logic
            const subTasks = await require('./src/services/aiService').generateSubTasks(data);
            socket.emit('sub-tasks', subTasks);
        } catch (error) {
            console.error('Error generating sub-tasks:', error);
            socket.emit('error', { message: 'Error generating sub-tasks' });
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(\`Server running on port \${PORT}\`);
});`
  }
];

files.forEach(file => {
  const dir = path.dirname(file.path);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(file.path, file.content, 'utf8');
  console.log(`Created ${file.path}`);
});