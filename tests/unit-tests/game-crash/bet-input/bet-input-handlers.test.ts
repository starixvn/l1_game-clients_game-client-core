import { stub } from "jest-auto-stub";

import { BetInputHandler } from "../../../../src/game-crash/bet-input/bet-input-handlers";
import { BetInputStore } from "../../../../src/game-crash/bet-input/bet-input-store";
import { RoundStore } from "../../../../src/game/rounds/round-store";

describe("BetInputHandler", () => {
    let betInputHandler: BetInputHandler;
    let roundStore: RoundStore;
    let betInputStore: BetInputStore;

    beforeEach(() => {
        roundStore = stub<RoundStore>();
        betInputStore = stub<BetInputStore>({ betAmountTemp: 10 });
        betInputHandler = new BetInputHandler(betInputStore, roundStore);
    });

    describe("handle", () => {
        it("should update bet amount for betInputStore", () => {
            // Arrange

            // Act
            betInputHandler.handle();

            // Assert
            expect(betInputHandler["betInputStore"].betAmount).toEqual(10);
        });
    });
});
