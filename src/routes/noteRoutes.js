const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');

// Routes for Note management
router.post('/create', noteController.createNote);
router.get('/', noteController.getNotes);
router.get('/:id', noteController.getNoteById);
router.put('/:id', noteController.updateNoteById);
router.delete('/:id', noteController.deleteNoteById);

module.exports = router;
