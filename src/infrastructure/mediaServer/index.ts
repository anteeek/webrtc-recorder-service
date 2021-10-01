import RTCStreamRecorder, { RTCStreamRecorderEvent } from "./RTCStreamRecorder";

const recorders: {
	[streamId: string]: RTCStreamRecorder;
} = {};

const mediaServer = {
	onStreamerConnect(params: { streamId: string; offerSdp: string }) {
		if (recorders[params.streamId]) {
			this.onStreamerDisconnect(params.streamId);
		}

		const recorder = (recorders[params.streamId] = new RTCStreamRecorder({
			offerSdp: params.offerSdp,
		}));

		recorder.emitter.addListener(RTCStreamRecorderEvent.STOPPED, () => {
			delete recorders[params.streamId];
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
