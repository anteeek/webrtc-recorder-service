import convertVideoFn from "../../../src/infrastructure/kodak/videoConverter/convertVideoFn";

import path from "path";
import fse from "fs-extra";

const RAW_VIDEO_PATH = path.resolve(__dirname, "mocks", "video.mp4");
const OUTPUT_DIR = path.resolve(`/tmp/kodak-test-outputs-video`);

describe("Video convert function", () => {
    beforeAll(async () => {
        await fse.remove(OUTPUT_DIR);
        await fse.ensureDir(OUTPUT_DIR);
    });

    jest.setTimeout(50000);

    it("Should convert the video", async () => {
        const buildDirContentsBefore = await fse.readdir(OUTPUT_DIR);

        await convertVideoFn(RAW_VIDEO_PATH, OUTPUT_DIR);

        const buildDirContentsAfter = await fse.readdir(OUTPUT_DIR);

        expect(buildDirContentsBefore).not.toEqual(buildDirContentsAfter);

        expect(buildDirContentsAfter).toMatchInlineSnapshot(`
            Array [
              "manifest.m3u8",
              "manifest0.ts",
              "manifest1.ts",
              "manifest2.ts",
              "manifest3.ts",
              "manifest4.ts",
            ]
        `);
    });
});
