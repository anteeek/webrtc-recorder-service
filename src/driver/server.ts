import http from "http";

import AppError from "../infrastructure/common/AppError";
import Logger from "../infrastructure/common/Logger";

import express, {
	NextFunction,
	Request as ExpressRequest,
	Response as ExpressResponse,
} from "express";

import bodyParser from "body-parser";
import morgan from "morgan";

import rootRouter from "./router";

import config from "../infrastructure/config";

export default async function bootstrapHttpServer() {
	const app = express();

	app.use(
		morgan("dev", {
			stream: {
				write(str) {
					Logger.info(str);
				},
			},
		})
	);

	/**
	 * ----------Various-------------
	 */

	app.use(bodyParser.json());

	/**
	 * --------- App -------------------
	 */

	app.use(rootRouter);

	/**
	 * --------------------------------
	 */

	app.use(
		(
			err: any,
			req: ExpressRequest,
			res: ExpressResponse,
			next: NextFunction
		) => {
			Logger.error(`Error during a http request:`, err);

			if (err instanceof AppError) {
				return res.status(402).json({
					success: false,
					error: err,
				});
			} else {
				res.status(503).json({
					success: false,
					error: err,
				});

				throw err;
			}
		}
	);

	const server = http.createServer({}, app);

	server.listen(config.PORT);
	Logger.info(`listening on http://localhost:${config.PORT}`);
}
