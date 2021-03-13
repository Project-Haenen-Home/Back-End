import { Request, Response, Router } from "express";

import { pool } from "../db";
import * as sql from "../functions/sql-helpers";
import IControllerBase from "interfaces/IControllerBase";
import { personSchema } from "../models/Person";

class PersonController implements IControllerBase {
	public path = "/people";
	public router = Router();

	constructor() {
		this.initRoutes();
	}

	public initRoutes() {
		this.router.get("/", this.getAllPeople);
		this.router.get("/:personID", this.getPerson);
		this.router.patch("/:personID", this.patchPerson);
	}

	getAllPeople = async (req: Request, res: Response) => {
		try {
			const { rows } = await pool.query('SELECT * FROM "People"');

			res.json(rows);
		} catch (err) {
			console.log(err);
			res.status(500).json();
		}
	};

	getPerson = async (req: Request, res: Response) => {
		var id = Number(req.params.personID);
		if (!Number.isNaN(id)) {
			try {
				const { rows, rowCount } = await pool.query(
					`SELECT * FROM "People" WHERE "id"=${id}`
				);

				if (rowCount > 0) res.json(rows[0]);
				else res.status(404).json({ error: "Person does not exist!" });
			} catch (err) {
				console.log(err);
				res.status(500).json();
			}
		} else res.status(400).json({ error: "ID field must be a number" });
	};

	patchPerson = async (req: Request, res: Response) => {
		const id = Number(req.params.personID);
		if (!Number.isNaN(id)) {
			const result = personSchema.partial().safeParse(req.body);

			if (result.success) {
				if (Object.entries(result.data).length > 0) {
					try {
						const { rowCount } = await pool.query(
							`UPDATE "People" SET ${sql.equalKeyValues(
								result.data
							)} WHERE "id"=${id}`
						);

						if (rowCount > 0) res.status(204).json();
						else res.status(400).json({ error: "ID does not exist" });
					} catch (err) {
						console.log(err);
						res.status(500).json(err);
					}
				} else res.status(400).json({ error: "Request body is empty" });
			} else res.status(400).json(result.error);
		} else res.status(400).json({ error: "ID field must be a number" });
	};
}

export default PersonController;
