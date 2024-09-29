const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Routes for Task management
router.post('/create', taskController.createTask);
router.post('/generate-subtasks', taskController.generateSubTasks);
router.get('/', taskController.getTasks);
router.get('/:taskId/subtasks', taskController.getSubTasks);
router.put('/:id', taskController.updateTaskById);
router.delete('/:id', taskController.deleteTaskById);
router.put('subtasks/:id', taskController.updateSubTaskById);
router.delete('subtasks/:id', taskController.deleteSubTaskById);

module.exports = router;