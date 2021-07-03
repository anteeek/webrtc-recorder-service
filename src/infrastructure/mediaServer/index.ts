import DzemStream from "./DzemStream";

const streams: {
    [streamId: string]: DzemStream;
} = {};

const mediaServer = {
    connect(params: {
        streamId: string;
        offerSdp: string;
    }) {
        if (streams[params.streamId]) {
            this.disconnect(params.streamId)
        }

        const stream = streams[params.streamId] = new DzemStream(params);

        stream.onEnd(() => {
            delete streams[params.streamId];
        });

        return {
            answerSdp: stream.answerSdp
        }
    },
    disconnect(streamId: string) {
        streams[streamId]?.end();
        delete streams[streamId];
    }
}


export default mediaServer;