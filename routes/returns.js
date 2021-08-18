const express = require("express");
const router = express.Router();
const Joi = require("joi");
const moment = require("moment");
const auth = require("../middleware/auth");
const validate = require("../middleware/validator");
const { Rental } = require("../models/rental");
const { Movie } = require("../models/movies");

router.post("/", [auth, /* validate(validateReturn) */], async (req, res) => {
  const { error } = validateReturn(req.body);
  if (error) return res.status(400).send(error.details[0].message);
//   const { customerId, movieId } = req.body;
//   if (!customerId) return res.status(400).send("Invalid customerId");
//   if (!movieId) return res.status(400).send("Invalid movieId");

  const rental = await Rental.findOne({
    "customer._id": req.body.customerId,
    "movie._id": req.body.movieId,
  });
  if (!rental) return res.status(404).send("no rental found");
  if (rental.dateReturned)
    return res.status(400).send("Return already processed.");

  rental.dateReturned = new Date();
  const rentalDays = moment().diff(rental.dateOut, "days");
  rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;

  await Movie.update(
    { _id: rental.movie._id },
    {
      $inc: { numberInStock: 1 },
    }
  );
  await rental.save();

  return res.status(200).send(rental);
});

function validateReturn(ret) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });

  return schema.validate(ret);
}

module.exports = router;
