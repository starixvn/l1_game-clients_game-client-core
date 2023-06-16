import { stub } from "jest-auto-stub";
import { when } from "mobx";
import { RoundStore, RoundTimeStore, RoundUIHandlers } from "../../../../src/game/rounds";
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
            it("should set When for this.roundTimeStore.roundState === ROUND_STATE.STARTING_ROUND", () => {
                // Arrange

                // Act
                handler = new RoundUIHandlers.StartingRoundHandler(roundTimeStore, roundStore, settlementStatusStore);

                // Assert
                expect(when).toBeCalled();
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
