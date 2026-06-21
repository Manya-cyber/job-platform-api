//to make sure we r scra[ing uniquely internship]

const crypto = require('crypto');

function computeHash(internship) {
    const combined = internship.title + internship.company + internship.apply_url;
    const hash = crypto.createHash('sha256').update(combined).digest('hex');
    return hash;
}

module.exports = { computeHash };