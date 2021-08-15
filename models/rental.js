const mongoose = require("mongoose");
const Joi = require("joi");

const rentalSchema = mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
      name: {
        type: String,
        minlength: 3,
        maxlength: 50,
        required: true,
      },
      isGold: {
        type: Boolean,
        default: false,
      },
      phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 15,
      },
    }),
  },
  movie: {
    type: new mongoose.Schema({
        title: {
            type: String,
            required: true,
            trim: true,
        },
        dailyRentalRate:{
            type: Number,
            required: true
        }
    }),
    required: true,
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now
  },
  dateReturned:{
      type: Date
  },
  rentalFee:{
      type: Number,
      min: 0
  }
});

const Rental =  mongoose.model('Rental',rentalSchema)

function validateRental(rental){
    const schema = Joi.object({
        customerId: Joi.string().required(),
        movieId: Joi.string().required()
    })

    return schema.validate(rental); 
}

module.exports.Rental = Rental;
module.exports.validateRental = validateRental;