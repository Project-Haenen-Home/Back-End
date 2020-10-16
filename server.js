const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require('path');

app.use(cors());

console.log("Server started.\n")
console.log("Mongoose(v" + mongoose.version + ") initialized.\n");

require("dotenv/config")
global.serverRoot = path.resolve(__dirname);

app.listen(2400);

mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}, () => console.log("Connected to database."));

app.use(bodyParser.json());

const taskRoute = require("./routes/Taken/task");
const roomRoute = require("./routes/Taken/room");
const personRoute = require("./routes/person");

app.use("/task", taskRoute);
app.use("/room", roomRoute);
app.use("/person", personRoute);