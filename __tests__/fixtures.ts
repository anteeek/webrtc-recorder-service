import * as fakers from "./fakers";
import { Stream } from "../src/domain/stream";
import StreamRepository from "../src/infrastructure/mongodb/stream";
import { serializeStream } from "../src/infrastructure/serializers";

export async function fixtureSavedStream() {
    const stream = getStream();

    await StreamRepository.save(stream);

    return serializeStream(stream);
}

export function getStream(
    streamParams: Partial<Parameters<typeof Stream["hydrate"]>[0]> = {}
): Stream {
    const stream = Stream.hydrate({
        ...fakers.getStreamDTO(),
        ...streamParams,
    });

    if (stream.isSuccess === false) throw stream.error;

    return stream.value;
}