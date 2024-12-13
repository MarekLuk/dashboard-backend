const Joi = require('joi');

const schemaUpdate = Joi.object({
    title: Joi.string().min(3).max(20).trim().required(),
    description: Joi.string().min(5).max(50).trim().required(),
    isCompleted: Joi.boolean().required()
});

const schemaCreate = Joi.object({
    title: Joi.string().min(3).max(20).trim().required(),
    description: Joi.string().min(5).max(50).trim().required(),
});

const schemaEmail = Joi.object({
    email: Joi.string().email().required()
});

const schemaPassword = Joi.object({
    password: Joi.string().min(3).max(20).required()
});

module.exports = { schemaUpdate, schemaCreate, schemaEmail, schemaPassword };