const pool = require('../db');

//adding the bookkmark
async function bookmarksUsers (userId,jobId){

    const query = `INSERT INTO bookmarks (user_id, job_id) 
VALUES ($1, $2)
ON CONFLICT (user_id, job_id) DO NOTHING
RETURNING *`

const result =await pool.query(query,[userId,jobId])
return result.rows[0];

}


// getting the bookmark

async function getBookmarks(userId){

    const query= `
    SELECT jp.id, jp.title, jp.mode, jp.pay, jp.location, c.name AS company
FROM bookmarks b
JOIN job_postings jp ON jp.id = b.job_id
JOIN companies c ON c.id = jp.company_id
WHERE b.user_id = $1
    `

     const result =await pool.query(query,[userId])

    return result.rows;
}


//deleting the bookmark
async function bookmarksDel(userId,jobId){

    const query= `DELETE from bookmarks 
    WHERE user_id =$1 AND job_id= $2
    RETURNING *`

    const res=await pool.query(query,[userId,jobId])

    return res.rows[0];

}


module.exports = { bookmarks: bookmarksUsers, 
    getBookmarks: getBookmarks,
     bookmarksDel :bookmarksDel };
