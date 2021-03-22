import { Request, Response, Router } from "express";

import { pool } from "../db";
import * as sql from "../functions/sql-helpers";
import IControllerBase from "interfaces/IControllerBase";
import { roomSchema } from "../models/Room";

class RoomController implements IControllerBase {
	public path = "/rooms";
	public router = Router();

	constructor() {
		this.initRoutes();
	}

	public initRoutes() {
		this.router.get("/", this.getAllRooms);
		this.router.post("/", this.addRoom);
		this.router.get("/taskStats", this.getTaskStats);

		this.router.get("/:roomID", this.getRoom);
		this.router.patch("/:roomID", this.patchRoom);
		// this.router.delete("/:roomID", this.deleteRoom); TODO
	}

	getAllRooms = async (req: Request, res: Response) => {
		try {
			const { rows } = await pool.query('SELECT * FROM "Rooms"');

			res.json(rows);
		} catch (err) {
			console.log(err);
			res.status(500).json();
		}
	};

	addRoom = async (req: Request, res: Response) => {
		const result = roomSchema.safeParse(req.body);
		if (result.success) {
			const kv = sql.splitKeyValues(result.data);

			try {
				await pool.query(
					`INSERT INTO "Rooms" (${kv.keys}) VALUES (${kv.values})`
				);
				res.status(204).json();
			} catch (err) {
				console.log(err);
				res.status(500).json();
			}
		} else res.status(400).json(result.error);
	};

	getRoom = async (req: Request, res: Response) => {
		var id = Number(req.params.roomID);
		if (!Number.isNaN(id)) {
			try {
				const { rows, rowCount } = await pool.query(
					`SELECT * FROM "Rooms" WHERE "id"=${id}`
				);

				if (rowCount > 0) res.json(rows[0]);
				else res.status(404).json({ error: "Room does not exist!" });
			} catch (err) {
				console.log(err);
				res.status(500).json();
			}
		} else res.status(400).json({ error: "ID field must be a number" });
	};

	patchRoom = async (req: Request, res: Response) => {
		const id = Number(req.params.roomID);
		if (!Number.isNaN(id)) {
			const result = roomSchema.partial().safeParse(req.body);

			if (result.success) {
				if (Object.entries(result.data).length > 0) {
					try {
						const { rowCount } = await pool.query(
							`UPDATE "Rooms" SET ${sql.equalKeyValues(
								result.data
							)} WHERE "id"=${id}`
						);

						if (rowCount > 0) res.status(204).json();
						else
							res.status(400).json({
								error: "ID does not exist",
							});
					} catch (err) {
						console.log(err);
						res.status(500).json(err);
					}
				} else res.status(400).json({ error: "Request body is empty" });
			} else res.status(400).json(result.error);
		} else res.status(400).json({ error: "ID field must be a number" });
	};

	// TODO
	// deleteRoom = async (req: Request, res: Response) => {
	// 	var id = Number(req.params.roomID);
	// 	if (!Number.isNaN(id)) {
	// 		try {
	// 			const { rowCount } = await pool.query(
	// 				`DELETE FROM "Rooms" WHERE "id"=${id}`
	// 			);

	// 			if (rowCount > 0) res.status(204).json();
	// 			else res.status(404).json({ error: "Room does not exist!" });
	// 		} catch (err) {
	// 			console.log(err);
	// 			res.status(500).json();
	// 		}
	// 	} else res.status(400).json({ error: "ID field must be a number" });
	// };

	getTaskStats = async (req: Request, res: Response) => {
		try {
			let query = 'SELECT * FROM "RoomTaskStats"';

			const { rows } = await pool.query(query);

			res.json(rows);
		} catch (err) {
			console.log(err);
			res.status(500).json();
		}
	};
}

export default RoomController;
