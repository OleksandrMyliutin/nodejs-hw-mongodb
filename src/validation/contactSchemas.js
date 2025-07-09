import Joi from 'joi';

const stringRule = Joi.string().min(3).max(20);

export const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const createContactSchema = Joi.object({
    name: stringRule.required(),
    phoneNumber: stringRule.required(),
    email: Joi.string().email().min(3).max(50),
    isFavourite: Joi.boolean(),
    contactType: stringRule.required(),
});

export const updateContactSchema = Joi.object({
    name: stringRule,
    phoneNumber: stringRule,
    email: Joi.string().email().min(3).max(50),
    isFavourite: Joi.boolean(),
    contactType: stringRule,
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});