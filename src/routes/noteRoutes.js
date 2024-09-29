const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');

// Routes for Note management
router.post('/:id/create', noteController.createNote);
router.get('/', noteController.getNotes);
router.get('/:id', noteController.getNoteById);
router.get('/:userId', noteController.getNoteByUserId);
router.put('/:id', noteController.updateNoteById);
router.delete('/:id', noteController.deleteNoteById);

module.exports = router;
