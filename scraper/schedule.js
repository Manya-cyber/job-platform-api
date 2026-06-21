const cron = require('node-cron');
const { runScraper } = require('./run');

// Runs every 6 hours: at minute 0, hour 0,6,12,18
cron.schedule('0 */6 * * *', () => {
    console.log('Scheduled scrape starting:', new Date().toISOString());
    runScraper();
});

console.log('Scraper scheduler started. Waiting for next run...');