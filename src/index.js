const express = require("express");
const mongoose = require("mongoose");
const http = require("node:http");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const connectDB = require("./config/dbConn");
const route = require("./routes/index");

connectDB();
const app = express(cors);
app.use(bodyParser.json());
const server = http.createServer(app);
const port = process.env.PORT || 3000;

route(app);

mongoose.connection.once("open", () => {
  console.log("Connected to mongoDB");
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.log({ errorMongoose: err });
});
