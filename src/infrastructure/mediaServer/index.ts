import RTCStreamRecorder from "./RTCStreamRecorder";

const recorders: {
	[streamId: string]: RTCStreamRecorder;
} = {};

const mediaServer = {
	onStreamerConnect(params: { recorderId: string; offerSdp: string }) {
		if (recorders[params.recorderId]) {
			this.onStreamerDisconnect(params.recorderId);
		}

		const recorder = (recorders[params.recorderId] = new RTCStreamRecorder(
			params
		));

		recorder.onEnd(() => {
			delete recorders[params.recorderId];
		});

		return {
			answerSdp: recorder.answerSdp,
		};
	},
	onStreamerDisconnect(streamId: string) {
		recorders[streamId]?.end();
		delete recorders[streamId];
	},
};

export default mediaServer;
