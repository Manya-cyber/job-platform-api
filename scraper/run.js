const { fetchPage } = require('./aicte');
const { parseInternships } = require('./parser');
const { saveInternship } = require('./save');
const pool = require('../db');

const SOURCE_ID = 4;
const PAGES_TO_SCRAPE = 3; // start small, test before scaling up
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runScraper() {
    const runStartTime = new Date(); 
    console.log('Starting scraper...');

    for (let page = 1; page <= PAGES_TO_SCRAPE; page++) {
        console.log(`Fetching page ${page}...`);
        
        const data = await fetchPage(page);
        const internships = parseInternships(data.list);

        console.log(`Found ${internships.length} internships on page ${page}`);
       

        for (const internship of internships) {
            const saved = await saveInternship(internship, SOURCE_ID);
            console.log(`Saved: ${internship.title} (id: ${saved.id})`);
        }

         await sleep(1000);
    }
    const query=`UPDATE job_postings
SET is_active = FALSE
WHERE source_id = $1
  AND last_seen_at < $2  -- timestamp from before this run started`

  await pool.query(query,[SOURCE_ID,runStartTime])

    console.log('Scraper finished.');
}

module.exports = { runScraper };