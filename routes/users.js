const { User, validateUser } = require("../models/users");
const express = require("express");
const router = express.Router();
const _ = require("lodash");

router.get("/", async (req, res) => {
  User.find().then((user) => res.send(user));
});

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const userOne = await User.findOne({ email: req.body.email });
  if (userOne) return res.status(400).send("User is already registered");

  let user = new User(_.pick(req.body, ['name','email','password']));

  await user.save();
  res.send(_.pick(user, ['name','email']))
});

module.exports = router;
