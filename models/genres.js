const mongoose = require("mongoose");
const Joi = require("joi");

const genreSchema = mongoose.Schema({
    name: {
      type: String,
      minlength: 3,
      required: true,
    },
});

const Genre = mongoose.model("Genre", genreSchema);

function validateGenre(genre) {
    const schema = Joi.object({
      name: Joi.string().min(3).required(),
    });
  
    return schema.validate(genre);
}

module.exports.genreSchema = genreSchema;
module.exports.Genre = Genre;
module.exports.validateGenre = validateGenre;