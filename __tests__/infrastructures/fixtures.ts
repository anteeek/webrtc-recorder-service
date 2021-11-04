
import Moonshine from "../../src/infrastructure/moonshine";
//@ts-ignore
import * as wrtc from "wrtc";
import Peer from "simple-peer";
import { waitFor } from "../../src/infrastructure/common/utils";

export async function getStreamingMoonshine() {

    const moonshine = new Moonshine();
    const streamerPeer = new Peer({
        initiator: true,
        stream: getMediastream(),
        wrtc
    });

    const status = { hasConnected: false };

    streamerPeer.on("connect", () => { status.hasConnected = true; });

    moonshine.streamer.streamerConnected({
        onServerSignal: serverSignal => {
            streamerPeer.signal(serverSignal);
        }
    });

    streamerPeer.on("signal", (streamerSignal) => {
        moonshine.streamer.receiveStreamerSignal(streamerSignal);
    });

    await waitFor(() => {
        return status.hasConnected === true;
    }, 2000);

    process.on("beforeExit", () => {
        streamerPeer.end();
    });

    return moonshine;
}


export function getMediastream(): MediaStream & {
    kill: () => any;
} {
    const stream = new MediaStream();

    const source = new wrtc.nonstandard.RTCVideoSource();

    stream.addTrack(source.createTrack());

    const FAKE_FRAME_SIZE = 500;

    const frame = {
        width: FAKE_FRAME_SIZE,
        height: FAKE_FRAME_SIZE,
        data: new Uint8ClampedArray(FAKE_FRAME_SIZE * FAKE_FRAME_SIZE * 1.5)
    }

    for (let i = 0; i < frame.width * frame.height; i++) {
        frame.data[i] = 50000000;
    }

    const i = setInterval(() => {
        source.onFrame(frame);
    }, 100);

    //@ts-ignore
    stream.kill = () => {
        clearInterval(i);
    }

    process.on("beforeExit", () => {
        //@ts-ignore
        stream.kill();
    });

    //@ts-ignore
    return stream;
}

export async function getMoonshineViewer(moonshine: Moonshine) {

    const viewerPeer = new Peer({ initiator: false, wrtc });

    const status = { hasConnected: false };

    viewerPeer.on("connect", () => { status.hasConnected = true; });

    const viewerPort = moonshine.viewers.getViewerPort({
        onServerSignal: (serverSignal) => {
            viewerPeer.signal(serverSignal);
        }
    });

    viewerPeer.on("signal", (viewerSignal) => {
        viewerPort.receiveViewerSignal(viewerSignal);
    });

    await waitFor(() => {
        return status.hasConnected === true;
    }, 2000);

    return viewerPeer;
}