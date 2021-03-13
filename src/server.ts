require("dotenv/config");
import App from "./app";
import { json, urlencoded } from "express";
import TaskController from "./controllers/task";

const cors = require("cors");

const app = new App({
	port: 3000,
	controllers: [new TaskController()],
	middlewares: [cors(), json(), urlencoded({ extended: true })],
});

app.listen();

// const got = require("got");

// app.get("/update", async (req, res) => {
//     let data = {error: "Nothing happend"};

//     try {
//         const response = await got('http://172.17.0.1:2400/task');
//         data = JSON.parse(response.body);
//     } catch (error) {
//         console.log(error);
//     }

//     data.forEach(async (task) => {
//         console.log(task.name);
//         const { rows } = await pool.query(`SELECT * FROM "AllTasks" WHERE "name"='${task.name}'`);
//         console.log(rows);
//     });

//     res.json(data);
// })
