const { User, validateUser } = require("../models/users");
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");

router.get("/me", auth, async (req, res) => {
  const id = req.user._id;
  User.findById(id)
    .select("name")
    .then((user) => res.send(user));
});

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const userOne = await User.findOne({ email: req.body.email });
  if (userOne) return res.status(400).send("User is already registered");

  let user = new User(_.pick(req.body, ["name", "email", "password"]));
  let salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  const token = user.generateAuthToken();
  res.header("x-auth-token", token).send(_.pick(user, ["name", "email"]));
});

module.exports = router;
