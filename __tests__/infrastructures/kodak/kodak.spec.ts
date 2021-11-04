import path from "path";
import { v4 } from "uuid";
import fse from "fs-extra";

import kodak from "../../../src/infrastructure/kodak";
import dirManager from "../../../src/infrastructure/dirManager";

const SAMPLE_PIC_PATH = path.resolve(__dirname, "mocks", "picture.jpeg");
const SAMPLE_VID_PATH = path.resolve(__dirname, "mocks", "video.mp4");

async function getSamplePictureCopyPath() {
  const sPath = path.resolve(`/tmp/`, v4());

  await fse.copyFile(SAMPLE_PIC_PATH, sPath);

  return sPath;
}

async function getSampleVideoCopyPath() {
  const sPath = path.resolve(`/tmp/`, `${v4()}.mp4`);

  await fse.copyFile(SAMPLE_VID_PATH, sPath);

  return sPath;
}

describe.skip("Kodak", () => {
  describe("Person", () => {
    it("Should put profile pic into dir specified by dirManager", async () => {
      /*const sPath = await getSamplePictureCopyPath();

      expect(targetDirContentsAfter.length).toBeGreaterThan(0);

      expect(targetDirContentsAfter).toMatchInlineSnapshot(`
        Array [
          "large.png",
          "medium.png",
          "small.png",
          "tiny.png",
        ]
      `);*/
    });

  });

});
