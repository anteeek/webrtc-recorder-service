import AppError from "../../src/infrastructure/common/AppError";

describe("AppError", () => {

    describe("Comparison", () => {
        it("Should return true/false on normal cases", () => {

            expect(
                AppError.areEqual(
                    "ERR",
                    new AppError("ERR")
                )
            ).toEqual(true);

            expect(
                AppError.areEqual(
                    "ERR",
                    new AppError("ERR2")
                )
            ).toEqual(false);
        });

        it("Should return false on normal Error class even if message is the same", () => {
            expect(
                AppError.areEqual(
                    "ERR",
                    new Error("ERR")
                )
            ).toEqual(false);
        });
    })
})