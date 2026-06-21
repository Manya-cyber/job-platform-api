const pool = require('../db');

async function getMe(userId){


    const query= `
    SELECT 
    u.id, u.name, u.email,
    up.bio, up.education, up.experience_years
FROM users u
LEFT JOIN user_profile up ON up.user_id = u.id
WHERE u.id = $1
    
    `

    const result =await pool.query(query,[userId])
    return result.rows[0];

}

async function updateProfile(userId,bio,education,experience){
    const query= `UPDATE user_profile
SET bio = $1, education = $2, experience_years = $3
WHERE user_id = $4
RETURNING *`

const result = await pool.query(query,[bio,education,experience,userId])
return result.rows[0];
}


async function addSkill(userId,skillName){
    const skillQuery= ` INSERT INTO skills (skill_name)
        VALUES ($1)
        ON CONFLICT (skill_name) DO UPDATE SET skill_name = EXCLUDED.skill_name
        RETURNING id`

    const skillResult = await pool.query(skillQuery, [skillName]);
    const skillId = skillResult.rows[0].id;

    const linkQuery = `
        INSERT INTO user_skills (user_id, skill_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, skill_id) DO NOTHING
        RETURNING *
    `;

    const linkResult = await pool.query(linkQuery, [userId, skillId]);
    return linkResult.rows[0];


}


async function getSkills(userId){
    const query =` SELECT s.id, s.skill_name
FROM user_skills us
JOIN skills s ON s.id = us.skill_id
WHERE us.user_id = $1`

const result =await pool.query(query,[userId]);
return result.rows;
}


async function delUserSkills(userId,skillId){
    const query= `DELETE from user_skills
    WHERE user_id =$1 AND skill_id= $2
    RETURNING *`

    const res=await pool.query(query,[userId,skillId])

    return res.rows[0];

}
module.exports= {getMe,updateProfile,addSkill,getSkills,delUserSkills};