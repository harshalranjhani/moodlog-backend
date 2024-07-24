require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const dataRoutes = require("./routes/data");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Welcome to MoodLog!");
});

app.use("/data", dataRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
