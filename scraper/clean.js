function cleanMode(modeRaw) {
    // "Virtual Internship" → "remote"
    // "Full Time" → "onsite"
    // anything else → "onsite" (default)

    return modeRaw.includes('Virtual')?'remote':'onsite'
}
function cleanDuration(durationRaw) {
    const num = parseInt(durationRaw);  // extracts leading number: "6 Weeks" → 6

    if (durationRaw.includes('Week')) {
        return Math.round(num / 4);  // convert weeks to months
    }
    if (durationRaw.includes('Month')) {
        return num;  // already in months
    }
    return num;  // fallback
}

function cleanStipend(stipendRaw) {
    const match = stipendRaw.match(/\d+/);
    if (!match) {
        return 0;  // "Unpaid" has no digits, default to 0
    }
    return parseInt(match[0]);
}

module.exports = { cleanMode, cleanDuration, cleanStipend };