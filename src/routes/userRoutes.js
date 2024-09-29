const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// User routes
router.get('/', userController.getAllUsers);
router.post('/register', userController.register);
router.get('/:id', userController.getUserById);
router.get('/name/:name', userController.getUserByName);
router.delete('/:id', userController.deleteUserById);
router.put('/:id/thought', userController.updateThought);

module.exports = router;