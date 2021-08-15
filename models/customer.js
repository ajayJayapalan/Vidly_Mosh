const mongoose = require("mongoose");
const Joi = require("joi");

const customerSchema = mongoose.Schema({
    isGold: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      minlength: 3,
      maxlength: 50,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 15,
    },
});

const Customer = mongoose.model("Customer", customerSchema);

function validateCustomer(customer) {
    const schema = Joi.object({
      name: Joi.string().min(3).max(50).required(),
      phone: Joi.string().min(5).max(15).required(),
      isGold: Joi.boolean(),
    });
  
    return schema.validate(customer);
}


  
module.exports.Customer = Customer;
module.exports.validateCustomer = validateCustomer;
