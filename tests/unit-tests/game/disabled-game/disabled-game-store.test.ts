import { DisabledGameStore } from "../../../../src/game/disabled-game";

describe("DisabledGameStore tests", () => {
    let store: DisabledGameStore;

    beforeAll(() => {
        // arrange
        store = new DisabledGameStore();
    });

    describe("setGameStatus", () => {
        test.each([
            [true, true],
            [false, false],
        ])("should set disabled value correctly.", (input, expected) => {
            // act
            store.setGameStatus(input);

            // assert
            expect(store.disabled).toEqual(expected);
        });
    });

    describe("setShowPopup", () => {
        test.each([
            [true, true],
            [false, false],
        ])("should set showPopup value correctly.", (input, expected) => {
            // act
            store.setShowPopup(input);

            // assert
            expect(store.showPopup).toEqual(expected);
        });
    });
});
