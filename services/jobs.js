const pool = require('../db');

async function searchJobs({ mode, job_type, location, search, skill, limit = 20, offset = 0 }) {

    const conditions = ['jp.is_active = TRUE'];
    const values = [];
    let i = 1;

    if (mode) {
        conditions.push(`jp.mode = $${i++}`);
        values.push(mode);
    }

    if (job_type) {
        conditions.push(`jp.job_type = $${i++}`);
        values.push(job_type);
    }

    if (location) {
        conditions.push(`jp.location ILIKE $${i++}`);
        values.push(`%${location}%`);
    }

    if (search) {
        conditions.push(`to_tsvector('english', jp.title) @@ plainto_tsquery('english', $${i++})`);
        values.push(search);
    }

    if (skill) {
        conditions.push(`s.skill_name ILIKE $${i++}`);
        values.push(skill);
    }

    const whereClause = conditions.join(' AND ');
    values.push(limit, offset);

    const query = `
        SELECT 
            jp.id,
            jp.title,
            jp.mode,
            jp.job_type,
            jp.location,
            jp.pay,
            jp.apply_url,
            jp.first_seen_at,
            c.name                         AS company,
            STRING_AGG(s.skill_name, ', ') AS skills
        FROM job_postings jp
        JOIN  companies    c  ON c.id      = jp.company_id
        LEFT JOIN job_skills js ON js.job_id = jp.id
        LEFT JOIN skills    s  ON s.id     = js.skill_id
        WHERE ${whereClause}
        GROUP BY jp.id, jp.title, jp.mode, jp.job_type,
                 jp.location, jp.pay, jp.apply_url,
                 jp.first_seen_at, c.name
        ORDER BY jp.first_seen_at DESC
        LIMIT $${i++} OFFSET $${i++}
    `;

    const result = await pool.query(query, values);
    return result.rows;
}

async function getJobById(id) {
    const query = `
        SELECT 
            jp.id,
            jp.title,
            jp.mode,
            jp.job_type,
            jp.location,
            jp.pay,
            jp.duration,
            jp.experience,
            jp.apply_url,
            jp.first_seen_at,
            c.name                         AS company,
            src.name                       AS source,
            STRING_AGG(s.skill_name, ', ') AS skills
        FROM job_postings jp
        JOIN  companies    c   ON c.id      = jp.company_id
        JOIN  sources      src ON src.id    = jp.source_id
        LEFT JOIN job_skills js ON js.job_id = jp.id
        LEFT JOIN skills    s   ON s.id     = js.skill_id
        WHERE jp.id = $1
          AND jp.is_active = TRUE
        GROUP BY jp.id, jp.title, jp.mode, jp.job_type,
                 jp.location, jp.pay, jp.duration, jp.experience,
                 jp.apply_url, jp.first_seen_at, c.name, src.name
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
}
module.exports = { searchJobs, getJobById };
