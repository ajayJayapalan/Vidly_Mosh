const express = require("express");
const app = express();
const config = require("config");

require("dotenv").config();
require("./startup/logging")();
require("./startup/route")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();
require("./startup/prod")(app);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () =>
  console.log(`Listening in http://localhost:${PORT}/api/`)
);

module.exports = server;
