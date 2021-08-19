const express = require("express");
const router = express.Router();
const Joi = require("joi");
const moment = require("moment");
const auth = require("../middleware/auth");
const validate = require("../middleware/validator");
const { Rental } = require("../models/rental");
const { Movie } = require("../models/movies");

router.post("/", [auth, validate(validateReturn)], async (req, res) => {
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

  console.log(rental);
  if (!rental) return res.status(404).send("no rental found");
  if (rental.dateReturned)
    return res.status(400).send("Return already processed.");

  rental.return();

  await Movie.update(
    { _id: rental.movie._id },
    {
      $inc: { numberInStock: 1 },
    }
  );
  await rental.save();

  return res.send(rental);
});

function validateReturn(ret) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });

  return schema.validate(ret);
}

module.exports = router;
