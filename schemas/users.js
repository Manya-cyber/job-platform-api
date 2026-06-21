const { z } = require('zod');

const addSkillSchema = z.object({
    skill_name: z.string().min(2, 'skill_name must be at least 2 characters'),
});

const updateProfileSchema = z.object({
    bio:              z.string().optional(),
    education:        z.string().optional(),
    experience_years: z.number().min(0).optional(),
});

module.exports = { addSkillSchema, updateProfileSchema };