const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobControllers');

router.get('/', jobController.getAllJobs);
router.get('/search', jobController.searchJobs);
router.get('/:id', jobController.getJobById);
router.post('/apply/:id', jobController.applyJob);
router.post('/match/:id', jobController.getMatchScore);

module.exports = router;
