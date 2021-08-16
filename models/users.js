const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    minlength: 1,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minlength: 3,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(1).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(3).required(),
  });

  return schema.validate(user);
}

module.exports.User = User;
module.exports.validateUser = validateUser;
