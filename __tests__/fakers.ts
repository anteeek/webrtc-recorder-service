import faker from "faker";
import ms from "ms";
import slugify from "slugify";

export function getStreamInit() {
    return {
        name: faker.commerce.productName(),
        slug: slugify(faker.commerce.productName()),
        schedule: {
            start: Date.now() + ms(`2 hours`),
            estimatedDuration: ms(`2 hours`)
        },
        recordingOptions: {
            isRecorded: faker.datatype.boolean()
        },
        isPublished: faker.datatype.boolean()
    }
}

export function getStreamDTO() {
    return {
        id: faker.datatype.string(15),
        name: faker.commerce.productName(),
        slug: slugify(faker.commerce.productName()),
        schedule: {
            start: Date.now() + ms(`2 hours`),
            estimatedDuration: ms(`2 hours`)
        },
        recordingOptions: {
            isRecorded: faker.datatype.boolean()
        },
        isPublished: faker.datatype.boolean()
    }
}