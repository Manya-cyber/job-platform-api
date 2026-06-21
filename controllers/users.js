const getMyuserProfile = require('../services/users');

async function getMe(req,res){
    try{
         const userId =req.user.userId;


const ans = await getMyuserProfile.getMe(userId);

if (!ans) { return res.status(404).json({ error: 'User not found' }) }
return res.json(ans);
        
    }
    catch(error){
res.status(500).json({
    "error" : "something went wrong"
})
    }
    

   
}


async function updateProfile(req,res){
    try{
            const userId = req.user.userId;

    const{bio,education,experience_years}= req.body;
    const updating = await getMyuserProfile.updateProfile(userId,bio,education,experience_years);
    if(!updating){
        return res.status(400).json({"msg":"error found"})
    }
    return res.status(200).json(updating)

    }catch(error){

        return res.status(500).json({"error":"server error"})

    }




    
}

async function addSkill(req, res) {
    try {
        const userId = req.user.userId;
        const { skill_name } = req.body;

        if (!skill_name) {
            return res.status(400).json({ error: 'skill_name is required' });
        }

        const result = await getMyuserProfile.addSkill(userId, skill_name);

        if (!result) {
            return res.status(400).json({ error: 'Skill already added' });
        }
        return res.status(201).json(result);

    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
}


async function getSkills(req,res){
    try{
    const userId =req.user.userId;
    const userskills =await getMyuserProfile.getSkills(userId);

    if(!userskills){
        return res.status(400).json({"msg":"some erro found"})
    }
    return res.status(200).json(userskills);
    }catch(error){
        res.status(500).json({"error":"server error"})

    }


}

async function delSkillsUser(req,res){

try{
   
    const userId = req.user.userId;
    const skillId=req.params.id;

    const isDeleted =await getMyuserProfile.delUserSkills(userId,skillId);

if (!isDeleted) {
    return res.status(404).json({ error: 'skll not found' });
}
return res.status(200).json({ message: 'skill removed' });


}catch(error){
    res.status(500).json({"error":"server error"})
}


}
module.exports ={ getMe,updateProfile,addSkill,getSkills,delSkillsUser};