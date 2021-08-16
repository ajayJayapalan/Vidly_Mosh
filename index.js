require("express-async-errors");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
require("dotenv").config();
const winston = require('winston'); 
require('winston-mongodb')
const express = require("express");
const mongoose = require("mongoose");
const genres = require("./routes/genres");
const customers = require("./routes/customer");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const auth = require("./routes/auth");
const error = require("./middleware/error");
const { exist } = require("joi");

const app = express();
winston.add(new winston.transports.File({ filename: 'logfile.log' }));
// winston.add(new winston.transports.MongoDB, { db: : 'mongodb://localhost/vidly'})

process.on('uncaughtException',(err)=>{
    console.log("UNCAUGHT EXCEPTION")
    winston.error(err.message,err)
    exist(1)
})

process.on('unhandledRejection',(err)=>{
    console.log("UNHANDLED REJECTION")
    winston.error(err.message,err)
    exit(1)
})

mongoose
  .connect("mongodb://localhost/vidly", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.log("Could not connect to MongoDB...", err));

app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);

app.use(error)

app.listen(3000, () =>
  console.log("Listening in http://localhost:3000/api/")
);
