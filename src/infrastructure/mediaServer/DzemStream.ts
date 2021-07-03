import medoozeEndpoint from "./medooze";
import { CodecInfo, MediaInfo, SDPInfo } from "semantic-sdp";
import MediaServer, { Transport } from "medooze-media-server";
import portManager from "./portManager";
import { ChildProcessWithoutNullStreams } from "node:child_process";
import getFfmpegProcess from "./ffmpeg";

import config from "../config";

export default class DzemStream {
    private readonly transport: Transport;
    public readonly answerSdp: string;
    private recorderProcess: ChildProcessWithoutNullStreams;

    private readonly ports = {
        audio: portManager.getPort(),
        video: portManager.getPort(),
    };

    constructor(
        private readonly connectionParams: {
            offerSdp: string;
            streamId: string;
        }
    ) {
        const offer = SDPInfo.process(connectionParams.offerSdp);
        this.transport = medoozeEndpoint.createTransport(offer);
        this.transport.setBandwidthProbing(true);
        this.transport.setMaxProbingBitrate(1024000);
        this.transport.setRemoteProperties(offer);
        const answer = SDPInfo.process(this.connectionParams.offerSdp).answer({
            dtls: this.transport.getLocalDTLSInfo(),
            ice: this.transport.getLocalICEInfo(),
            candidates: medoozeEndpoint.getLocalCandidates(),
            //@ts-ignore
            capabilities: Capabilities,
        });

        this.transport.setLocalProperties(answer);

        this.answerSdp = answer.toString();

        this.recorderProcess = getFfmpegProcess({
            audioPort: this.ports.audio,
            videoPort: this.ports.video,
        });

        this.transport.on("stopped", () => {
            this.recorderProcess?.kill();
            portManager.freePort(this.ports.video);
            portManager.freePort(this.ports.audio);
        });
        this.bootstrapStreamer();
    }

    public end() {
        this.transport.stop();
    }

    public onEnd(listener: () => any) {
        this.transport.on("stopped", listener);
    }

    private bootstrapStreamer() {
        const incomingStream = this.transport.createIncomingStream(
            SDPInfo.process(this.connectionParams.offerSdp).getFirstStream()!
        );

        const streamer = MediaServer.createStreamer();

        //@ts-ignore
        const audio = new MediaInfo("audio", "audio");
        audio.addCodec(
            //@ts-ignore
            new CodecInfo(
                config.MEDIA_SERVER.AUDIO_CODEC,
                config.MEDIA_SERVER.AUDIO_PAYLOAD
            )
        );

        const streamerSessionAudio = streamer.createSession(audio, {
            remote: {
                ip: "127.0.0.1",
                port: this.ports.audio,
            },
        });

        streamerSessionAudio
            .getOutgoingStreamTrack()
            .attachTo(incomingStream.getAudioTracks()[0]);

        //@ts-ignore
        const video = new MediaInfo("video", "video");
        video.addCodec(
            //@ts-ignore
            new CodecInfo(
                config.MEDIA_SERVER.VIDEO_CODEC,
                config.MEDIA_SERVER.VIDEO_PAYLOAD
            )
        );

        const streamerSessionVideo = streamer.createSession(video, {
            remote: {
                ip: "127.0.0.1",
                port: this.ports.video,
            },
        });

        streamerSessionVideo
            .getOutgoingStreamTrack()
            .attachTo(incomingStream.getVideoTracks()[0]);
    }
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
