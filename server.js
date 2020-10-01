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

const taskRoute = require("./routes/task");
const roomRoute = require("./routes/room");
const personRoute = require("./routes/person");

app.use("/task", taskRoute);
app.use("/room", roomRoute);
app.use("/person", personRoute);

app.get("/", async function (getReq, getRes) {
    let data;
    try {
        data = await readfile("app/dist/index.html");
    } catch (err) {
        getRes.writeHead(500, "HTTP error" + err,  {"Content-Type": "text/html"});
        return;
    }

    getRes.writeHead(200, {"Content-Type": "text/html"});
    getRes.write(data);
    getRes.end();  
});