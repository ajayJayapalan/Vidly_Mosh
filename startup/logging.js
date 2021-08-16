require("express-async-errors");
const winston = require("winston")
require("winston-mongodb");

module.exports = function () {
  winston.add(new winston.transports.File({ filename: "logfile.log" }));
  // winston.add(new winston.transports.MongoDB, { db: : 'mongodb://localhost/vidly'})


  winston.exceptions.handle(
    new winston.transports.File({ filename: "uncaughtExceptions.log" }),
    new winston.transports.Console({ colorize: true, prettyPrint: true })
  );

  process.on("unhandledRejection", ex => {
    throw ex;
  });

//   process.on("uncaughtException", (err) => {
//     console.log("UNCAUGHT EXCEPTION");
//     winston.error(err.message, err);
//     process.exist?.(1);
//   });

//   process.on("unhandledRejection", (err) => {
//     console.log("UNHANDLED REJECTION");
//     winston.error(err.message, err);
//     process.exit?.(1);
//   });
};
