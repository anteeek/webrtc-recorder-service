import { Router } from "express";
import AppError from "../../infrastructure/common/AppError";
import mediaServer from "../../infrastructure/mediaServer";

const recorderRouter = Router();

recorderRouter.post(`/api/recorder/:streamId`, async (req, res) => {
	const offerSdp = req.body?.offerSdp;

	if (!offerSdp) {
		throw new AppError("No offer SDP supplied in request body", {
			httpCode: 400,
		});
	}

	const streamId = req.params["streamId"];

	if (!streamId) {
		throw new AppError("No stream id supplied in request url", {
			httpCode: 400,
		});
	}

	const { answerSdp } = mediaServer.onStreamerConnect({
		offerSdp,
		streamId,
	});

	return res.status(200).json({
		success: true,
		data: { answerSdp },
	});
});

export { recorderRouter };
