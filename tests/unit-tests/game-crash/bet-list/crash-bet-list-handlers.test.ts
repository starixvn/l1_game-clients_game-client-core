import { stub } from "jest-auto-stub";

import { CrashBetListHandlers } from "../../../../src/game-crash/bet-list/crash-bet-list-handlers";
import { CrashBetListStore } from "../../../../src/game-crash/bet-list/crash-bet-list-store";
import { CrashCashOutStore } from "../../../../src/game-crash/cash-out/crash-cash-out-store";
import { BetStore } from "../../../../src/game/bets/bet-store";
import { RoundTimeStore } from "../../../../src/game/rounds/round-time-store";
import { MainPlayerStore } from "../../../../src/players/main-player-store";

describe("CrashBetListHandlers", () => {
    let betListHandlers: CrashBetListHandlers;
    let mainPlayerStore: MainPlayerStore;
    let crashCashOutStore: CrashCashOutStore;
    let roundTimeStore: RoundTimeStore;
    let betStore: BetStore;
    let betListStore: CrashBetListStore;

    beforeAll(() => {
        mainPlayerStore = stub<MainPlayerStore>();
        crashCashOutStore = stub<CrashCashOutStore>();
        roundTimeStore = stub<RoundTimeStore>();
        betStore = stub<BetStore>();
        betListStore = stub<CrashBetListStore>();
    });

    beforeEach(() => {
        betListHandlers = new CrashBetListHandlers(mainPlayerStore, crashCashOutStore, roundTimeStore, betStore, betListStore);
    });

    describe("reactionPlacingBet", () => {
        beforeEach(() => {
            // Arrange
            betListHandlers["resetMainPlayer"] = jest.fn();
            betListHandlers["resetOtherPlayerList"] = jest.fn();
        });

        describe("when starting place bet", () => {
            const isStartPlacingBet = true;

            it("should call resetMainPlayer()", () => {
                // Act
                betListHandlers["reactionPlacingBet"](isStartPlacingBet);

                // Assert
                expect(betListHandlers["resetMainPlayer"]).toBeCalled();
            });

            it("should call resetOtherPlayerList()", () => {
                // Act
                betListHandlers["reactionPlacingBet"](isStartPlacingBet);

                // Assert
                expect(betListHandlers["resetOtherPlayerList"]).toBeCalled();
            });
        });
        describe("when not starting placing bet ", () => {
            const isStartPlacingBet = false;

            it("should not call resetMainPlayer()", () => {
                // Act
                betListHandlers["reactionPlacingBet"](isStartPlacingBet);

                // Assert
                expect(betListHandlers["resetMainPlayer"]).not.toBeCalled();
            });

            it("should not call resetOtherPlayerList()", () => {
                // Act
                betListHandlers["reactionPlacingBet"](isStartPlacingBet);

                // Assert
                expect(betListHandlers["resetOtherPlayerList"]).not.toBeCalled();
            });
        });
    });
});
