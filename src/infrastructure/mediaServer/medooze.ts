import MediaServer from "medooze-media-server";
import config from "../../config";

MediaServer.enableDebug(false);
MediaServer.enableUltraDebug(false);

MediaServer.setPortRange(
	config.MEDIA_SERVER.MIN_PORT,
	config.MEDIA_SERVER.MAX_PORT
);

const medoozeEndpoint = MediaServer.createEndpoint("127.0.0.1");

export default medoozeEndpoint;
