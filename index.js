const express = require("express");
const app = express();

require("dotenv").config();
require("./startup/logging")();
require("./startup/route")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();
require("./startup/prod")(app);

const server = app.listen(3000, () => console.log("Listening in http://localhost:3000/api/"));

module.exports = server;
