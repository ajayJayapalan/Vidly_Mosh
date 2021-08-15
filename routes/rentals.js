const { Rental, validateRental } = require("../models/rental");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movies");
const express = require("express");
const mongoose = require("mongoose");
const Fawn = require("fawn");
const router = express.Router();

Fawn.init(mongoose);

router.get("/", (req, res) => {
  Rental.find()
    .sort("-dateOut")
    .then((movies) => res.send(movies));
});

router.post("/", async (req, res) => {
  const { error } = validateRental(req.body);

  const customer = await Customer.findById(req.body.customerId);
  if (error) return res.status(400).send(error.details[0].message);

  const movie = await Movie.findById(req.body.movieId);
  if (error) return res.status(400).send(error.details[0].message);

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not in stock");

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: customer._id,
      title: customer.title,
      dailyRentalRate: customer.dailyRentalRate,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });

 try {
    new Fawn.Task()
      .save("rentals", rental)
      .update(
        "movies",
        { _id: movie._id },
        {
          $inc: { numberInStock: -1 },
        }
      )
      .run();

    res.send(rental);
  } catch (err) {
    res.status(500).send("Something failed.");
  }
});

module.exports = router;
