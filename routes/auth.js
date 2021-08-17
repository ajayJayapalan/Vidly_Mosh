const { User } = require("../models/users");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");


router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const userOne = await User.findOne({ email: req.body.email });
  if (!userOne) return res.status(400).send("Invalid email or password");

  const validPassword = await bcrypt.compare(
    req.body.password,
    userOne.password
  ); // return true if password match
  if (!validPassword) return res.status(400).send("Invalid email or password");
  const token = userOne.generateAuthToken();
  res.send(token);
});

function validateUser(user) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(3).required(),
  });

  return schema.validate(user);
}

module.exports = router;
