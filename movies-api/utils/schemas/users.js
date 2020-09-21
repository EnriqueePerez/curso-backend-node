const joi = require('joi');

const userIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);

const userSchema = {
  name: joi.string().max(100).required(),
  email: joi.string().email().required(),
  password: joi.string().required(),
};

//Using the base userSchema and adding the isAdmin attribute
const createUserSchema = {
  ...userSchema,
  isAdmin: joi.boolean(),
};

//Using the base userSchema and adding the apiKeyToken
const createProviderUserSchema = {
  ...userSchema,
  apiKeyToken: joi.string().required(),
};

module.exports = { userIdSchema, createUserSchema, createProviderUserSchema };
