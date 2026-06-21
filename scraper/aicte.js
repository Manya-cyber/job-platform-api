const axios = require('axios');

async function fetchPage(pageNum) {
    const response = await axios.post(
        'https://internship.aicte-india.org/class/class_internship.php',
        new URLSearchParams({
            action: 'load_internship',
            location: 'all',
            internship_type: 'all',
            internship_stipend: 'all',
            page: pageNum
        }),
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    );

    return response.data; // { list: "<html>...", pagination: "<html>..." }
}

module.exports = { fetchPage };