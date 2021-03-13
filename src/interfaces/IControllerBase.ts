import { Router } from "express";

interface IControllerBase {
	initRoutes(): void;
	path: string;
	router: Router;
}

export default IControllerBase;
