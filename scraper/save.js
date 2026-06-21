const pool = require('../db');
const { computeHash } = require('./hash');

async function saveInternship(internship, sourceId) {

    // 1. get or create company → get companyId
    const companyQuery = `
        INSERT INTO companies (name)
        VALUES ($1)
        ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
        RETURNING id
    `;
    const companyResult = await pool.query(companyQuery, [internship.company]);
    const companyId = companyResult.rows[0].id;

    // 2. compute content_hash
    const hashValue = computeHash(internship);

    // 3. upsert into job_postings
    const jobQuery = `
        INSERT INTO job_postings 
            (company_id, source_id, title, job_type, mode, location, pay, duration, apply_url, content_hash)
        VALUES 
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (content_hash)
        DO UPDATE SET
            last_seen_at = NOW(),
            is_active = TRUE,
            pay = EXCLUDED.pay
        RETURNING id
    `;

    const result = await pool.query(jobQuery, [
        companyId,
        sourceId,
        internship.title,
        'internship',
        internship.mode,
        internship.location,
        internship.pay,
        internship.duration,
        internship.apply_url,
        hashValue
    ]);

    return result.rows[0];
}

module.exports = { saveInternship };