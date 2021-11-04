import * as serializers from "../src/infrastructure/serializers";

import { getStreamDTO } from "./fakers";
import { getStream } from "./fixtures";

describe("Serializers", () => {

    it("Should serialize stream", () => {
        const streamInit = getStreamDTO();

        const stream = getStream(streamInit)

        const serializedStream = serializers.serializeStream(stream);

        expect(serializedStream).toEqual({
            name: streamInit.name,
            slug: streamInit.slug,
            isPublished: streamInit.isPublished,
            recordingOptions: streamInit.recordingOptions,
            schedule: streamInit.schedule,
            id: streamInit.id
        });
    });
})