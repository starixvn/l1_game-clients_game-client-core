import { stub } from "jest-auto-stub";
import * as lodash from "lodash";
import { CrashCashOutStore } from "../../../../src/game-crash/cash-out/crash-cash-out-store";
import { ButtonState } from "../../../../src/game-crash/game-crash-messages";
import { PlayerActionStore } from "../../../../src/game-crash/player-actions/player-action-store";
import { ProvablyFairStore } from "../../../../src/game-crash/provably-fair/provably-fair-store";
jest.mock("lodash", () => ({
    random: jest.fn(() => 1234),
}));

describe("ProvablyFairStore", () => {
    let provablyFairStore: ProvablyFairStore;
    let playerActionStore: PlayerActionStore;
    let crashCashOutStore: CrashCashOutStore;

    beforeAll(() => {
        playerActionStore = stub<PlayerActionStore>();
        crashCashOutStore = stub<CrashCashOutStore>();
    });

    beforeEach(() => {
        jest.clearAllMocks();
        provablyFairStore = new ProvablyFairStore(playerActionStore, crashCashOutStore);
    });

    describe("randomClientSeedValue", () => {
        it("should call random function", () => {
            //Act
            const result = provablyFairStore["randomClientSeedValue"]();

            //Assert
            expect(lodash.random).toBeCalledWith(1000, 9999);
        });
    });

    describe("notAllowChangeClientSeed", () => {
        it("when button state is BET ACCEPTED", () => {
            //Arrange
            playerActionStore.buttonState = ButtonState.BET_ACCEPTED;

            //Assert
            expect(provablyFairStore.notAllowChangeClientSeed).toEqual(true);
        });
        describe("when button state is CASHOUT", () => {
            beforeEach(() => {
                playerActionStore.buttonState = ButtonState.CASH_OUT;
            });
            it(" isFullCashedOut is true", () => {
                //Arrange
                Object.defineProperty(crashCashOutStore, "isFullCashedOut", { value: true, writable: true, configurable: true });

                //Assert
                expect(provablyFairStore.notAllowChangeClientSeed).toEqual(false);
            });

            it(" isFullCashedOut is false", () => {
                //Arrange
                Object.defineProperty(crashCashOutStore, "isFullCashedOut", { value: false, writable: true, configurable: true });

                //Assert
                expect(provablyFairStore.notAllowChangeClientSeed).toEqual(true);
            });
        });

        it("when button state is PLACE BET", () => {
            //Arrange
            playerActionStore.buttonState = ButtonState.PLACE_BET;

            //Assert
            expect(provablyFairStore.notAllowChangeClientSeed).toEqual(false);
        });
    });
});
