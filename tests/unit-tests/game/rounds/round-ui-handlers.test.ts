import { stub } from "jest-auto-stub";
import { reaction } from "mobx";
import { RoundStore, RoundTimeStore, RoundUIHandlers } from "../../../../src/game/rounds";
import { SettlementStatusStore, SettlementStore } from "../../../../src/game/settlements";

jest.mock("mobx", () => {
    return {
        reaction: jest.fn(),
    };
});
describe("RoundUIHandlers tests", () => {
    describe("StartingRoundHandler", () => {
        let handler: RoundUIHandlers.StartingRoundHandler;
        let roundTimeStore: RoundTimeStore;
        let roundStore: RoundStore;
        let settlementStatusStore: SettlementStatusStore;
        let settlementStore: SettlementStore;
        beforeAll(() => {
            roundTimeStore = stub<RoundTimeStore>();
            roundStore = stub<RoundStore>();
            settlementStatusStore = stub<SettlementStatusStore>();
            settlementStore = stub<SettlementStore>();
        });

        describe("constructor", () => {
            it("should set reaction for this.roundTimeStore.roundState === ROUND_STATE.STARTING_ROUND", () => {
                // Arrange

                // Act
                handler = new RoundUIHandlers.StartingRoundHandler(roundTimeStore, roundStore, settlementStatusStore, settlementStore);

                // Assert
                expect(reaction).toBeCalled();
            });
        });

        describe("handle", () => {
            it("should call reset some stores", () => {
                // Arrange
                handler = new RoundUIHandlers.StartingRoundHandler(roundTimeStore, roundStore, settlementStatusStore, settlementStore);
                roundStore.resetForNewRound = jest.fn();
                settlementStatusStore.resetSettlementStatus = jest.fn();
                settlementStore.resetSettlementStore = jest.fn();
                // Act
                handler.handle();

                // Assert
                expect(roundStore.resetForNewRound).toBeCalled();
                expect(settlementStatusStore.resetSettlementStatus).toBeCalled();
                expect(settlementStore.resetSettlementStore).toBeCalled();
            });
        });
    });
});
