import medoozeEndpoint from "./medooze";
import { CodecInfo, MediaInfo, SDPInfo } from "semantic-sdp";
import MediaServer, { StreamerSession, Transport } from "medooze-media-server";
import portManager from "./portManager";
import { ChildProcessWithoutNullStreams } from "child_process";
import getFfmpegProcess from "./ffmpeg";

import config from "../config";
import EventEmitter from "events";

export default class RTCStreamRecorder {
	private transport!: Transport;
	public answerSdp!: string;
	public readonly emitter = new EventEmitter();
	private recorderProcess!: ChildProcessWithoutNullStreams;
	private videoStreamerSession!: StreamerSession;
	private streamerSessionAudio!: StreamerSession;

	private readonly ports = {
		audio: portManager.getPort(),
		video: portManager.getPort(),
	};

	constructor(
		private readonly options: {
			offerSdp: string;
			outputsDir: string;
		}
	) {
		this.startRecorderProcess();

		this.startMedoozeStream();

		this.initEvents();
	}

	public end() {
		this.transport.stop();
		if (this.recorderProcess.exitCode !== null) {
			this.recorderProcess.kill();
		}
		portManager.freePort(this.ports.video);
		portManager.freePort(this.ports.audio);
	}

	private initEvents() {
		this.transport.on("stopped", () =>
			this.emitter.emit(RTCStreamRecorderEvent.STOPPED)
		);
		this.recorderProcess.on("exit", () =>
			this.emitter.emit(RTCStreamRecorderEvent.STOPPED)
		);
		this.emitter.on(RTCStreamRecorderEvent.STOPPED, () => {
			this.end();
		});
	}

	private startRecorderProcess() {
		this.recorderProcess = getFfmpegProcess({
			audioPort: this.ports.audio,
			videoPort: this.ports.video,
		});
	}

	private startMedoozeStream() {
		const { transport, answerSdp } = createMedoozeTransport(
			this.options.offerSdp
		);

		this.transport = transport;
		this.answerSdp = answerSdp.toString();

		const incomingStream = this.transport.createIncomingStream(
			SDPInfo.process(this.options.offerSdp).getFirstStream()!
		);

		const { videoStreamerSession, audioStreamerSession } =
			createMedoozeStreamerSessions({
				audioPort: this.ports.audio,
				videoPort: this.ports.video,
			});

		this.videoStreamerSession = videoStreamerSession;
		this.streamerSessionAudio = audioStreamerSession;

		this.streamerSessionAudio
			.getOutgoingStreamTrack()
			.attachTo(incomingStream.getAudioTracks()[0]);

		this.videoStreamerSession
			.getOutgoingStreamTrack()
			.attachTo(incomingStream.getVideoTracks()[0]);
	}
}

export enum RTCStreamRecorderEvent {
	STOPPED = "stopped",
}

function createMedoozeStreamerSessions({
	audioPort,
	videoPort,
}: {
	audioPort: number;
	videoPort: number;
}) {
	const medoozeStreamer = MediaServer.createStreamer();

	//@ts-ignore
	const audio = new MediaInfo("audio", "audio");
	audio.addCodec(
		new CodecInfo(
			//@ts-ignore
			config.MEDIA_SERVER.AUDIO_CODEC,
			config.MEDIA_SERVER.AUDIO_PAYLOAD
		)
	);

	const audioStreamerSession = medoozeStreamer.createSession(audio, {
		remote: {
			ip: "127.0.0.1",
			port: audioPort,
		},
	});

	//@ts-ignore
	const video = new MediaInfo("video", "video");
	video.addCodec(
		new CodecInfo(
			//@ts-ignore
			config.MEDIA_SERVER.VIDEO_CODEC,
			config.MEDIA_SERVER.VIDEO_PAYLOAD
		)
	);

	const videoStreamerSession = medoozeStreamer.createSession(video, {
		remote: {
			ip: "127.0.0.1",
			port: videoPort,
		},
	});

	return {
		videoStreamerSession,
		audioStreamerSession,
	};
}

function createMedoozeTransport(offerSdp: string) {
	const offer = SDPInfo.process(offerSdp);
	const transport = medoozeEndpoint.createTransport(offer);
	transport.setBandwidthProbing(true);
	transport.setMaxProbingBitrate(1024000);
	transport.setRemoteProperties(offer);
	const answerSdp = SDPInfo.process(offerSdp).answer({
		dtls: transport.getLocalDTLSInfo(),
		ice: transport.getLocalICEInfo(),
		candidates: medoozeEndpoint.getLocalCandidates(),
		//@ts-ignore
		capabilities: Capabilities,
	});

	transport.setLocalProperties(answerSdp);

	return {
		transport,
		answerSdp,
	};
}

const Capabilities = {
	audio: {
		codecs: ["opus"],
		extensions: ["urn:ietf:params:rtp-hdrext:ssrc-audio-level"],
	},
	video: {
		codecs: ["h264;packetization-mode=1"],
		rtx: true,
		rtcpfbs: [
			{ id: "transport-cc" },
			{ id: "ccm", params: ["fir"] },
			{ id: "nack" },
			{ id: "nack", params: ["pli"] },
		],
		extensions: [
			"http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01",
		],
	},
};
