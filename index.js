const express = require("express")
const genres = require("./routes/genres")

const app = express()

app.use(express.json())
app.use("/api/genres",genres)


app.listen(3000,()=> console.log("Listening in http://localhost:3000/api/genres"))