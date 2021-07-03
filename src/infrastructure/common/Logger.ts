import winston from "winston";
import fse from "fs-extra";
import path from "path";

import config from "../config";

fse.ensureDirSync(config.LOGS_DESTINATION_PATH);

const prettyFormat = winston.format.combine(
	winston.format.colorize({
		colors: {
			"info": "blue",
			"error": "red"
		}
	}),
	winston.format.printf(
		info => `[${info.level}]: ${info.message}\n`
	)
)

const prodFormat = winston.format.combine(
	winston.format.uncolorize(),
	winston.format.json(),
	winston.format.timestamp(),
)

const Logger = winston.createLogger({
	level: config.IS_TEST ? "info" : "silly",
	format: config.IS_DEV ? prettyFormat : prodFormat,
	transports: [
		new winston.transports.File({ filename: path.resolve(config.LOGS_DESTINATION_PATH, "multiplexer-error.log"), level: 'error' }),
		new winston.transports.File({ filename: path.resolve(config.LOGS_DESTINATION_PATH, "multiplexer-combined.log") }),
		new winston.transports.Console({})
	],
});


export default Logger;