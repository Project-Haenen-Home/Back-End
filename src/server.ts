require("dotenv/config");

import App from "./app";
import { json, urlencoded } from "express";
import TaskController from "./controllers/task";
import PersonController from "./controllers/person";
import RoomController from "./controllers/room";

const app = new App({
	port: 3000,
	controllers: [
		new TaskController(),
		new PersonController(),
		new RoomController(),
	],
	middlewares: [require("cors")(), json(), urlencoded({ extended: true })],
});

app.listen();
