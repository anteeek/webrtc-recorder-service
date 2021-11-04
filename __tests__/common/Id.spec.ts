import Id from "../../src/domain/common/Id";
import { ISuccess } from "../../src/domain/types";

describe("Unique ID", () => {

    describe("Creation & hydration", () => {

        it("Should create a unique string when .create", () => {
            const id = Id.create();

            expect(id.value).toBeTruthy();
            expect(typeof id.value).toEqual("string");
            expect(id.value.length).toBeGreaterThan(3);
        });

        it("Should take the string and leave it as-is when .hydrate", () => {
            const rawId = "bajojajo";
            const id = Id.hydrate(rawId) as ISuccess<Id>;

            expect(id.value.value).toEqual(rawId);
        });
    });

    describe("Comparison", () => {

        it("Should be equal to itself", () => {

            const id = Id.create();

            expect(
                id.isEqual(id)
            ).toEqual(
                true
            );
        });

        it("Should be equal to it's primitive rawId", () => {

            const id = Id.create();

            expect(
                id.isEqual(id.value)
            ).toEqual(
                true
            );

        })

        it("Should be equal to another instance with same rawId", () => {

            const id = Id.create();
            const sameId = Id.hydrate(id.value) as ISuccess<Id>;

            expect(
                sameId.value.isEqual(id)
            ).toEqual(
                true
            );
        });

        it("Should NOT be equal to another instance with diff. rawId", () => {

            const id = Id.create();
            const otherId = Id.create();

            expect(
                id.isEqual(otherId)
            ).toEqual(
                false
            );
        });


    })
})