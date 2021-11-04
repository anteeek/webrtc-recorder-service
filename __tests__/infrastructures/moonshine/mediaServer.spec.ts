import config from "../../../src/infrastructure/config";
import portManager from "../../../src/infrastructure/mediaServer/portManager";
import mediaServer from "../../../src/infrastructure/mediaServer";
import { v4 } from "uuid";
import { getMediastream } from "../fixtures";
import { waitFor } from "../../../src/infrastructure/common/utils";


describe("Media server", () => {

    describe("Connection", () => {

        it("Should let you connect and return a sdp answer", async () => {
            const peer = new RTCPeerConnection();

            const streamId = v4();

            getMediastream().getTracks().forEach(track => peer.addTrack(track));
            const offer = await peer.createOffer();
            await peer.setLocalDescription(offer);


            const result = mediaServer.connect({
                streamId,
                offerSdp: offer.sdp!
            });

            await peer.setRemoteDescription({
                sdp: result.answerSdp,
                type: "answer"
            });

            await waitFor(() => {
                return peer.connectionState === "connected";
            }, 2500);

            expect(peer.connectionState).toEqual("connected");

            expect(
                () => mediaServer.disconnect(streamId)
            ).not.toThrowError();
        });

    });

    describe("port manager", () => {

        it("Should give ports in the range", () => {
            for (let i = 0; i < 100; i++) {
                const port = portManager.getPort();

                expect(port).toBeGreaterThanOrEqual(config.MEDIA_SERVER.MIN_PORT);
                expect(port).toBeLessThanOrEqual(config.MEDIA_SERVER.MAX_PORT);

                expect(() => portManager.freePort(port)).not.toThrowError();
            }
        });
    })
})