const express = require("express");
const mongoose = require("mongoose");
const genres = require("./routes/genres");

const app = express();

mongoose
  .connect("mongodb://localhost/vidly", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.log("Could not connect to MongoDB...", err));

app.use(express.json());
app.use("/api/genres", genres);

app.listen(3000, () =>
  console.log("Listening in http://localhost:3000/api/genres")
);
