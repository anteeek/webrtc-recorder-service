import Moonshine from "../../../src/infrastructure/moonshine";
import { getStreamingMoonshine, getMediastream } from "../fixtures";
import { waitFor } from "../../../src/infrastructure/common/utils";
import Peer from "simple-peer";
//@ts-ignore
import * as wrtc from "wrtc";

describe("Moonshine", () => {

    it("Should accept an incoming streamer connection", async () => {

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

        expect(status.hasConnected).toEqual(true);

        streamerPeer.end();
    });

    it("Should accept an incoming viewer connection", async () => {
        const moonshine = await getStreamingMoonshine();

        const viewerPeer = new Peer({ initiator: true, wrtc });

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

        expect(status.hasConnected).toEqual(true);
    });

    it("Should feed the viewer a stream upon connection", async () => {

        const moonshine = await getStreamingMoonshine();

        const viewerPeer = new Peer({ initiator: true, wrtc });

        const status = { hasStream: false };

        viewerPeer.on("stream", () => { status.hasStream = true; });

        const viewerPort = moonshine.viewers.getViewerPort({
            onServerSignal: (serverSignal) => {
                viewerPeer.signal(serverSignal);
            }
        });

        viewerPeer.on("signal", (viewerSignal) => {
            viewerPort.receiveViewerSignal(viewerSignal);
        });

        await waitFor(() => {
            return status.hasStream === true;
        }, 2000);

        expect(status.hasStream).toEqual(true);
    });
});