const express = require('express');
const router = express.Router();
const { runScraper } = require('../scraper/run');
router.post('/run', async (req, res) => {
    const secret = req.headers['x-scraper-secret'];
    if (secret !== process.env.SCRAPER_SECRET) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        await runScraper();
        res.json({ message: 'Scraper completed successfully' });
    } catch (error) {
        console.error('Scraper error:', error.message);
        res.status(500).json({ error: 'Scraper failed' });
    }
});

module.exports = router;