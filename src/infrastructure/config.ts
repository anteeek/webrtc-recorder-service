import path from "path";
import { readEnv } from "./env";

const validEnvironments = ["development", "test"];
const NODE_ENV = process.env.NODE_ENV?.toLowerCase()!;

if (validEnvironments.includes(NODE_ENV) !== true)
	throw new Error(
		`Invalid environment ${NODE_ENV}. Specify one of: ${JSON.stringify(
			validEnvironments
		)}`
	);

const IS_DEV = ["test", "development"].includes(NODE_ENV);

const Env = readEnv();

export default {
	...Env,

	MEDIA_SERVER: {
		MIN_PORT: 10000,
		MAX_PORT: 30000,
		AUDIO_PAYLOAD: 109,
		AUDIO_CLOCKRATE: 48000,
		AUDIO_CHANNELS: 2,
		AUDIO_CODEC: "opus",

		VIDEO_PAYLOAD: 96,
		VIDEO_CLOCKRATE: 90000,
		VIDEO_CODEC: "h264",
	},

	PORT: 10010,

	IS_DEV,
	IS_TEST: NODE_ENV === "test",

	LOGS_DESTINATION_PATH: path.resolve(Env.OUTPUTS_DIR, "logs"),
	ASSETS_DIR: path.resolve(Env.OUTPUTS_DIR, "outputs"),
};
