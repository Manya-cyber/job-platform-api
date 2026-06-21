const { fetchPage } = require('./aicte');
const { parseInternships } = require('./parser');

async function test() {
    const data = await fetchPage(1);
    const internships = parseInternships(data.list);
    console.log(internships);
}

test();