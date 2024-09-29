const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Routes for Job tracker
router.post('/search', jobController.searchJobs);
router.get('/', jobController.getJobs);
router.post('/add', jobController.addJob);
router.get('/:id', jobController.getJobById); 
router.put('/:id', jobController.updateJob); 
router.delete('/:id', jobController.deleteJob); 

module.exports = router;