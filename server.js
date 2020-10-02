const express = require("express");
const app = express();
const fs = require("fs");
const util = require("util");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require('path');

console.log("Server started.\n")
console.log("Mongoose(v" + mongoose.version + ") initialized.\n");


require("dotenv/config")
global.serverRoot = path.resolve(__dirname);

app.listen(2400);

const readfile = util.promisify(fs.readFile);

mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}, () => console.log("Connected to database."));

app.use(bodyParser.json());

app.use((res, req, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if(req.method == "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

const taskRoute = require("./routes/task");
const roomRoute = require("./routes/room");
const personRoute = require("./routes/person");

app.use("/task", taskRoute);
app.use("/room", roomRoute);
app.use("/person", personRoute);