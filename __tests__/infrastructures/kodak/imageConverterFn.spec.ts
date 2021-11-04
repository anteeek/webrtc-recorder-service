import convertImageFn from "../../../src/infrastructure/kodak/imageConverter";

import path from "path";
import fse from "fs-extra";

const RAW_THUMBNAIL_PATH = path.resolve(__dirname, "mocks", "picture.jpeg");
const OUTPUT_DIR = path.resolve(`/tmp/kodak-test-outputs-thumbnail`);

describe("Video convert function", () => {
  beforeAll(async () => {
    await fse.remove(OUTPUT_DIR);
    await fse.ensureDir(OUTPUT_DIR);
  });

  jest.setTimeout(50000);

  it("Should convert the thumbnail", async () => {
    const buildDirContentsBefore = await fse.readdir(OUTPUT_DIR);

    await convertImageFn({
      outputDir: OUTPUT_DIR,
      rawImagePath: RAW_THUMBNAIL_PATH,
    });

    const buildDirContentsAfter = await fse.readdir(OUTPUT_DIR);

    expect(buildDirContentsBefore).not.toEqual(buildDirContentsAfter);

    expect(buildDirContentsAfter).toMatchInlineSnapshot(`
      Array [
        "large.png",
        "medium.png",
        "small.png",
        "tiny.png",
      ]
    `);
  });
});
