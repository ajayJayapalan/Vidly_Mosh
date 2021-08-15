const mongoose = require("mongoose");
const Joi = require("joi");
const { genreSchema } = require("./genres");

const movieSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,

    },
    genre: genreSchema,
    numberInStock: {
        type: Number,
        default: 0
    },
    dailyRentalRate:{
        type: Number,
        required: true
    }
})

const Movie = mongoose.model('Movie', movieSchema);

function validateMovie(movie) {
    const schema = Joi.object({
      title: Joi.string().max(50).required(),
      genreId: Joi.objectId().required(),
      numberInStock: Joi.number().min(0).required(),
      dailyRentalRate: Joi.number().min(0).required(),
    });
  
    return schema.validate(movie);
}

module.exports.Movie = Movie;
module.exports.validateMovie = validateMovie;