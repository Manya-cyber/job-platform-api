const jobService = require('../services/jobs');

async function searchJobs(req, res) {
    try {
        const { mode, job_type, location, search, skill, limit, offset } = req.query;

        const jobs = await jobService.searchJobs({
            mode,
            job_type,
            location,
            search,
            skill,
            limit:  limit  ? parseInt(limit)  : 20,
            offset: offset ? parseInt(offset) : 0
        });

        res.json({
            count: jobs.length,
            jobs
        });

    } catch (error) {
        console.error('searchJobs error:', error.message);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

async function getJobById(req, res) {
    try {
        const { id } = req.params;

        const job = await jobService.getJobById(id);

        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        res.json(job);

    } catch (error) {
        console.error('getJobById error:', error.message);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

module.exports = { searchJobs, getJobById };