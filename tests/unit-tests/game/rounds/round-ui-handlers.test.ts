// import { GameConfigStore } from "../../../../src/game/game-configs";
import { ROUND_STATE, RoundStore, RoundTimeStore, RoundUIHandlers } from "../../../../src/game/rounds";
// import { MainPlayerStore } from "../../../../src/players";
import { stub } from "jest-auto-stub";
import { when } from "mobx";
import { SettlementStatusStore } from "../../../../src/game/settlements";

jest.mock("mobx", () => {
    return {
        when: jest.fn(),
    };
});
describe("RoundUIHandlers tests", () => {
    describe("StartingRoundHandler", () => {
        let handler: RoundUIHandlers.StartingRoundHandler;
        let roundTimeStore: RoundTimeStore;
        let roundStore: RoundStore;
        let settlementStatusStore: SettlementStatusStore;
        beforeAll(() => {
            roundTimeStore = stub<RoundTimeStore>();
            roundStore = stub<RoundStore>();
            settlementStatusStore = stub<SettlementStatusStore>();
        });

        describe("constructor", () => {
            it("should set When for isStartingRound", () => {
                // Arrange

                // Act
                handler = new RoundUIHandlers.StartingRoundHandler(roundTimeStore, roundStore, settlementStatusStore);

                // Assert
                expect(when).toBeCalledWith(handler.isStartingRound, handler.handle);
            });
        });

        describe("isStartingRound", () => {
            it("should return true, when round state is STARTING_ROUND", () => {
                // Arrange
                handler = new RoundUIHandlers.StartingRoundHandler(roundTimeStore, roundStore, settlementStatusStore);
                roundTimeStore.roundState = ROUND_STATE.STARTING_ROUND;

                // Act
                const result = handler.isStartingRound();

                // Assert
                expect(result).toEqual(true);
            });

            it("should return false, when round state is not STARTING_ROUND", () => {
                // Arrange
                handler = new RoundUIHandlers.StartingRoundHandler(roundTimeStore, roundStore, settlementStatusStore);
                roundTimeStore.roundState = ROUND_STATE.PLACING_BET;

                // Act
                const result = handler.isStartingRound();

                // Assert
                expect(result).toEqual(false);
            });
        });

        describe("handle", () => {
            it("should call reset some stores", () => {
                // Arrange
                handler = new RoundUIHandlers.StartingRoundHandler(roundTimeStore, roundStore, settlementStatusStore);
                roundStore.resetForNewRound = jest.fn();
                settlementStatusStore.resetSettlementStatus = jest.fn();
                // Act
                handler.handle();

                // Assert
                expect(roundStore.resetForNewRound).toBeCalled();
                expect(settlementStatusStore.resetSettlementStatus).toBeCalled();
            });
        });
    });
});
