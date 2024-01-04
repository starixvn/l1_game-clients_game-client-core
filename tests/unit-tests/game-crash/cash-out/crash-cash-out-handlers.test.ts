import { stub } from "jest-auto-stub";

import { AutoPlayHandler } from "../../../../src/game-crash/auto-play/auto-play-handler";
import { AutoPlayStore } from "../../../../src/game-crash/auto-play/auto-play-store";
import { CrashCashOutHandlers } from "../../../../src/game-crash/cash-out/crash-cash-out-handlers";
import { CrashCashOutStore } from "../../../../src/game-crash/cash-out/crash-cash-out-store";
import { MultiplierStore } from "../../../../src/game-crash/multiplier/multiplier-store";
import { PlayerActionHandlers } from "../../../../src/game-crash/player-actions/player-action-handlers";
import { PlayerActionStore } from "../../../../src/game-crash/player-actions/player-action-store";
import { BetStore } from "../../../../src/game/bets/bet-store";
import { RoundHistoryStore } from "../../../../src/game/round-histories/round-history-store";
import { RoundTimeStore } from "../../../../src/game/rounds/round-time-store";

describe("CrashCashOutHandlers", () => {
    let cashOutHandlers: CrashCashOutHandlers;
    let cashOutStore: CrashCashOutStore;
    let roundHistoryStore: RoundHistoryStore;
    let roundTimeStore: RoundTimeStore;
    let betStore: BetStore;
    let multiplierStore: MultiplierStore;
    let playerActionStore: PlayerActionStore;
    let playerActionHandlers: PlayerActionHandlers;
    let autoPlayHandler: AutoPlayHandler;
    let autoPlayStore: AutoPlayStore;
    const halfCashOut = {
        amount: 25,
        win: 26.25,
        cashOutWin: 26.25,
        multiplier: 1.05,
        reachMaxWin: false,
    };
    const cashOut = {
        amount: 50,
        win: 54.5,
        cashOutWin: 54.5,
        multiplier: 1.09,
        reachMaxWin: false,
    };

    beforeAll(() => {
        cashOutStore = stub<CrashCashOutStore>({ setCashOutNotice: jest.fn() });
        roundHistoryStore = stub<RoundHistoryStore>();
        roundTimeStore = stub<RoundTimeStore>();
        betStore = stub<BetStore>();
        multiplierStore = stub<MultiplierStore>();
        playerActionStore = stub<PlayerActionStore>();
        playerActionHandlers = stub<PlayerActionHandlers>({ changeButtonBetNextRound: jest.fn() });
        autoPlayHandler = stub<AutoPlayHandler>({ autoEnableEarlyBet: jest.fn() });
        autoPlayStore = stub<AutoPlayStore>();
    });

    beforeEach(() => {
        cashOutHandlers = new CrashCashOutHandlers(
            cashOutStore,
            roundHistoryStore,
            roundTimeStore,
            betStore,
            multiplierStore,
            playerActionStore,
            playerActionHandlers,
            autoPlayHandler,
            autoPlayStore
        );
    });

    describe("handleCashOutHalf", () => {
        beforeEach(() => {
            // Arrange

            cashOutHandlers["handleHalfCashOutMessage"] = jest.fn();

            // Act
            cashOutHandlers["handleCashOutHalf"](halfCashOut);
        });

        it("should call handleHalfCashOutMessage()", () => {
            // Assert
            expect(cashOutHandlers["handleHalfCashOutMessage"]).toBeCalled();
        });

        it("should call setCashOutNotice() of CrashCashOutStore", () => {
            // Assert
            expect(cashOutStore.setCashOutNotice).toBeCalled();
        });
    });

    describe("handleHalfCashOutMessage", () => {
        beforeEach(() => {
            // Arrange
            cashOutHandlers["setHalfCashedOutValue"] = jest.fn();

            // Act
            cashOutHandlers["handleHalfCashOutMessage"](halfCashOut);
        });

        it("should update halfCashOut of CrashCashOutStore", () => {
            // Assert
            expect(cashOutStore.halfCashOut).toEqual(halfCashOut);
        });

        it("should call setHalfCashedOutValue()", () => {
            // Assert
            expect(cashOutHandlers["setHalfCashedOutValue"]).toBeCalled();
        });

        it("should update ratio of CrashCashOutStore", () => {
            // Assert
            expect(cashOutStore.ratio).toEqual(cashOutHandlers["halfCashOutRatio"]);
        });

        it("should update cashOutBet of CrashCashOutStore", () => {
            // Arrange
            cashOutStore = stub<CrashCashOutStore>({ cashOutBet: { value: 10 } });
            const expected = cashOutHandlers["cashOutStore"].cashOutBet.value * cashOutHandlers["halfCashOutRatio"];

            // Assert
            expect(cashOutHandlers["cashOutStore"].cashOutBet.value).toEqual(expected);
        });
    });

    describe("handleCashOutFull", () => {
        beforeEach(() => {
            // Arrange
            cashOutHandlers["hideCashOut"] = jest.fn();
            cashOutHandlers["handleCashOutMessage"] = jest.fn();

            // Act
            cashOutHandlers["handleCashOutFull"](cashOut);
        });

        it("should call handleCashOutMessage()", () => {
            // Assert
            expect(cashOutHandlers["handleCashOutMessage"]).toBeCalled();
        });

        it("should call setCashOutNotice() of CrashCashOutStore", () => {
            // Assert
            setTimeout(() => {
                expect(cashOutHandlers["hideCashOut"]).toBeCalled();
            }, cashOutHandlers["displayCashedOutDuration"]);
        });
    });

    describe("handleCashOutMessage", () => {
        beforeEach(() => {
            // Arrange
            cashOutHandlers["setFullCashedOutValue"] = jest.fn();
            cashOutHandlers["setHalfCashedOutValue"] = jest.fn();
        });

        it("should update cashOut of CrashCashOutStore", () => {
            // Act
            cashOutHandlers["handleCashOutMessage"](cashOut);

            // Assert
            expect(cashOutStore.cashOut).toEqual(cashOut);
        });

        it("should call setFullCashedOutValue()", () => {
            // Act
            cashOutHandlers["handleCashOutMessage"](cashOut);

            // Assert
            expect(cashOutHandlers["setFullCashedOutValue"]).toBeCalled();
        });

        describe("when have half cash out", () => {
            it("should not call setHalfCashedOutValue()", () => {
                // Arrange
                cashOutHandlers["cashOutStore"].isHalfCashedOut = true;

                // Act
                cashOutHandlers["handleCashOutMessage"](cashOut);

                // Assert
                expect(cashOutHandlers["setHalfCashedOutValue"]).not.toBeCalled();
            });
        });

        describe("when have not half cash out", () => {
            it("should call setHalfCashedOutValue()", () => {
                // Arrange
                cashOutHandlers["cashOutStore"].isHalfCashedOut = false;

                // Act
                cashOutHandlers["handleCashOutMessage"](cashOut);

                // Assert
                expect(cashOutHandlers["setHalfCashedOutValue"]).toBeCalled();
            });
        });
    });

    describe("setHalfCashedOutValue", () => {
        const value = 100;

        it("should update isHalfCashedOut to true", () => {
            // Arrange

            // Act
            cashOutHandlers["setHalfCashedOutValue"](value);

            // Assert
            expect(cashOutStore.isHalfCashedOut).toEqual(true);
        });

        it("should update halfCashOutValue", () => {
            // Arrange

            // Act
            cashOutHandlers["setHalfCashedOutValue"](value);

            // Assert
            expect(cashOutStore.halfCashOutValue).toEqual(value);
        });
    });

    describe("setFullCashedOutValue", () => {
        const value = 100;

        it("should update isFullCashedOut to true", () => {
            // Arrange

            // Act
            cashOutHandlers["setFullCashedOutValue"](value);

            // Assert
            expect(cashOutStore.isFullCashedOut).toEqual(true);
        });

        it("should update fullCashOutValue", () => {
            // Arrange

            // Act
            cashOutHandlers["setFullCashedOutValue"](value);

            // Assert
            expect(cashOutStore.fullCashOutValue).toEqual(value);
        });
    });

    describe("hideCashOut", () => {
        it("should update ratio of CrashCashOutStore", () => {
            // Arrange

            // Act
            cashOutHandlers["hideCashOut"]();

            // Assert
            expect(cashOutStore.ratio).toEqual(cashOutHandlers["fullCashOutRatio"]);
        });

        describe("when have auto play", () => {
            beforeEach(() => {
                // Arrange
                autoPlayStore = stub<AutoPlayStore>({ isValidAutoPlay: true });
                cashOutHandlers = new CrashCashOutHandlers(
                    cashOutStore,
                    roundHistoryStore,
                    roundTimeStore,
                    betStore,
                    multiplierStore,
                    playerActionStore,
                    playerActionHandlers,
                    autoPlayHandler,
                    autoPlayStore
                );

                // Act
                cashOutHandlers["hideCashOut"]();
            });

            it("should call autoEnableEarlyBet() of AutoPlayHandler", () => {
                // Assert
                expect(autoPlayHandler.autoEnableEarlyBet).toBeCalled();
            });

            it("should not call changeButtonBetNextRound() of PlayerActionHandlers", () => {
                // Assert
                expect(playerActionHandlers.changeButtonBetNextRound).not.toBeCalled();
            });
        });

        describe("when have not auto play", () => {
            beforeEach(() => {
                // Arrange
                autoPlayStore = stub<AutoPlayStore>({ isValidAutoPlay: false });
                cashOutHandlers = new CrashCashOutHandlers(
                    cashOutStore,
                    roundHistoryStore,
                    roundTimeStore,
                    betStore,
                    multiplierStore,
                    playerActionStore,
                    playerActionHandlers,
                    autoPlayHandler,
                    autoPlayStore
                );

                // Act
                cashOutHandlers["hideCashOut"]();
            });

            it("should not call autoEnableEarlyBet() of AutoPlayHandler", () => {
                // Assert
                expect(autoPlayHandler.autoEnableEarlyBet).not.toBeCalled();
            });

            it("should call changeButtonBetNextRound() of PlayerActionHandlers", () => {
                // Assert
                expect(playerActionHandlers.changeButtonBetNextRound).toBeCalled();
            });
        });
    });
});
