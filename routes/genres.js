const {Genre, validateGenre} = require("../models/genres")
//const asyncMiddleware = require("../middleware/async")
const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth")
const admin = require("../middleware/admin")


router.get("/" ,(req, res) => {
  Genre.find().then((genres) => res.send(genres));
});

router.get("/:id", async (req, res) => {
 // throw new Error("Genre throwing error..")
  const genre = await Genre.findById(req.params.id);
  if (!genre)
    return res.status(404).send("The genre with the given ID is not found");
  res.send(genre);
});

router.post("/", auth, async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({ name: req.body.name });
  genre = await genre.save();
  res.send(genre);
});

router.put("/:id", async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        name: req.body.name,
      },
    },
    {
      new: true,
    }
  );
  if (!genre)
    return res.status(404).send("The genre with the given ID is not found");
  res.send(genre);
});

router.delete("/:id",[auth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndDelete( req.params.id);
  if (!genre)
    return res.status(404).send("The genre with the given ID is not found");
  res.send(genre);
});

module.exports = router;
