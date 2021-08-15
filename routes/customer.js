const express = require("express");
const mongoose = require("mongoose");
const Joi = require("joi");
const router = express.Router();

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

router.get("/", (req, res) => {
  Customer.find().then((customers) => res.send(customers));
});

router.get("/:id", async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer)
      return res.status(404).send("The customer with the given ID is not found");
    res.send(customer);
  });

router.post("/", async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold
  });
  customer = await customer.save();
  res.send(customer);
});

router.put("/:id", async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name,
          isGold: req.body.isGold,
          phone: req.body.phone,
        },
      },
      {
        new: true,
      }
    );
    if (!customer)
      return res.status(404).send("The customer with the given ID is not found");
    res.send(customer);
  });
  
  router.delete("/:id", async (req, res) => {
    const customer = await Customer.findByIdAndDelete( req.params.id);
    if (!customer)
      return res.status(404).send("The customer with the given ID is not found");
    res.send(customer);
  });

function validateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    phone: Joi.string().min(5).max(15).required(),
    isGold: Joi.boolean(),
  });

  return schema.validate(customer);
}

module.exports = router;
