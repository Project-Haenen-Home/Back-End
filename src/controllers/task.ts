import { Request, Response, Router } from "express";

import { pool } from "../db";
import * as sql from "../functions/sql-helpers";
import IControllerBase from "interfaces/IControllerBase";
import { taskSchema } from "../models/Task";

class TaskController implements IControllerBase {
	public path = "/tasks";
	public router = Router();

	constructor() {
		this.initRoutes();
	}

	public initRoutes() {
		this.router.get("/", this.getAllTasks);
		this.router.post("/", this.addTask);
		this.router.get("/:taskID", this.getTask);
		this.router.patch("/:taskID", this.patchTask);
		this.router.post("/:taskID/finished", this.finishTask);
	}

	getAllTasks = async (req: Request, res: Response) => {
		try {
			const { rows } = await pool.query(
				'SELECT * FROM "AllTasks" ORDER BY "due" ASC nulls FIRST'
			);

			res.json(rows);
		} catch (err) {
			console.log(err);
			res.status(500).json();
		}
	};

	addTask = async (req: Request, res: Response) => {
		const result = taskSchema.safeParse(req.body);
		if (result.success) {
			const kv = sql.splitKeyValues(result.data);

			try {
				await pool.query(
					`INSERT INTO "Tasks" (${kv.keys}) VALUES (${kv.values})`
				);
				res.status(204).json();
			} catch (err) {
				console.log(err);
				res.status(500).json();
			}
		} else res.status(400).json(result.error);
	};

	getTask = async (req: Request, res: Response) => {
		var id = Number(req.params.taskID);
		if (!Number.isNaN(id)) {
			try {
				const { rows } = await pool.query(
					`SELECT * FROM "AllTasks" WHERE "id"=${id}`
				);

				if (rows.length > 0) res.json(rows[0]);
				else res.status(404).json({ error: "Task does not exist!" });
			} catch (err) {
				console.log(err);
				res.status(500).json();
			}
		} else res.status(400).json({ error: "ID field must be a number" });
	};

	patchTask = async (req: Request, res: Response) => {
		const id = Number(req.params.taskID);
		if (!Number.isNaN(id)) {
			const result = taskSchema.partial().safeParse(req.body);

			if (result.success) {
				try {
					const { rowCount } = await pool.query(
						`UPDATE "Tasks" SET ${sql.equalKeyValues(
							result.data
						)} WHERE "id"=${id}`
					);

					if (rowCount > 0) res.status(204).json();
					else res.status(400).json({ error: "ID does not exist" });
				} catch (err) {
					console.log(err);
					res.status(500).json(err);
				}
			} else res.status(400).json(result.error);
		} else res.status(400).json({ error: "ID field must be a number" });
	};

	finishTask = async (req: Request, res: Response) => {
		const id = Number(req.params.taskID);
		if (!Number.isNaN(id)) {
			const { rows } = await pool.query(
				`SELECT * FROM "Tasks" WHERE "id"=${id}`
			);
			if (rows.length == 0)
				res.status(404).json({ status: "ID does not exist" });
			else {
				const task = rows[0];
				let error = false;

				if (task.rotate) {
					const { rows } = await pool.query(
						`SELECT "personID" FROM "TaskRotation" WHERE "taskID"=${id} ORDER BY "personID" ASC`
					);
					let index;
					for (index = 0; index < rows.length - 1; index++) {
						if (rows[index].personID == task.personID) {
							break;
						}
					}

					let nextID = -1;
					console.log(index);
					if (index == rows.length - 1) {
						if (rows[index].personID != task.personID) index = -1;
						else nextID = rows[0].personID;
					} else nextID = rows[index + 1].personID;

					if (index >= 0) {
						try {
							await pool.query(
								`UPDATE "Tasks" SET "personID" = ${nextID} WHERE "id"=${id}`
							);
						} catch (err) {
							error = true;
							console.log(err);
							res.status(500).json();
						}
					} else error = true;
				}
				if (!error) {
					try {
						const now = new Date();
						const date = `${now.getUTCFullYear()}-${
							now.getUTCMonth() + 1
						}-${now.getUTCDate()}`;
						await pool.query(
							`INSERT INTO "TaskFinished" ("taskID", "date") VALUES (${id}, '${date}')`
						);
						res.status(204).json();
					} catch (err) {
						console.log(err);
						res.status(500).json();
					}
				}
			}
		} else res.status(400).json({ error: "ID field must be a number" });
	};
}

export default TaskController;
