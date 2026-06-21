const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobs');

router.get('/', jobController.searchJobs);

router.get('/:id', jobController.getJobById);
module.exports = router;