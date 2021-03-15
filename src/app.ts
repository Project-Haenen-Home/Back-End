import express, { Application } from "express";
import IControllerBase from "interfaces/IControllerBase";

class App {
	public app: Application;
	public port: number;

	constructor(appConfig: { port: number; middlewares: any; controllers: any }) {
		this.app = express();
		this.app.disable("x-powered-by");
		this.port = appConfig.port;

		this.middlewares(appConfig.middlewares);
		this.routes(appConfig.controllers);
	}

	private middlewares(middlewares: {
		forEach: (arg0: (middleware: any) => void) => void;
	}) {
		middlewares.forEach((middleware) => {
			this.app.use(middleware);
		});
	}

	private routes(controllers: {
		forEach: (arg0: (controller: IControllerBase) => void) => void;
	}) {
		controllers.forEach((controller) => {
			this.app.use(controller.path, controller.router);
		});
	}

	public listen() {
		this.app.listen(this.port, () => {
			console.log(`API listening on port ${this.port}`);
		});
	}
}

export default App;
