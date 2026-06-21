const express = require('express');
const router = express.Router();
const getMeController = require('../controllers/users');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validate');
const {addSkillSchema,updateProfileSchema}= require('../schemas/users');

router.get('/me',authMiddleware, getMeController.getMe);
router.put('/me/profile', authMiddleware,validate(updateProfileSchema),getMeController.updateProfile)
router.post('/me/skills',authMiddleware, validate(addSkillSchema),  getMeController.addSkill);
router.get('/me/skills',authMiddleware,getMeController.getSkills)
router.delete('/me/skills/:id',authMiddleware,getMeController.delSkillsUser)

module.exports = router;



