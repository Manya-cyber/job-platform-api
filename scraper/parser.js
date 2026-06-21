const cheerio = require('cheerio');
const { cleanMode, cleanDuration, cleanStipend } = require('./clean');

function parseInternships(html) {
    const $ = cheerio.load(html);
    const internships = [];

    $('.internship-item').each((i, el) => {
        const title       = $(el).find('.job-title').text().trim();
        const company     = $(el).find('.company-name').text().trim();
        const modeRaw     = $(el).find('.wfh span').text().trim();
        const location     = $(el).find('.location span').text().trim();
        const durationRaw  = $(el).find('.duration span').text().trim();
        const stipendRaw   = $(el).find('.stipend').first().find('span').text().trim();
        const applyHref    = $(el).find('a.detailsBtn4').attr('href');

        internships.push({
            title,
            company,
            mode:      cleanMode(modeRaw),
            location:  location.replace(',', '').trim(),  // remove trailing comma
            duration:  cleanDuration(durationRaw),
            pay:       cleanStipend(stipendRaw),
            apply_url: `https://internship.aicte-india.org/${applyHref}`
        });
    });

    return internships;
}

module.exports = { parseInternships };