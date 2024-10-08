import { ConnectionHandlers } from "../../../src/game/connection";
import { SettlementStatusStore, SettlementStore } from "../../../src/game/settlements";
import { EmitEventToGameClient } from "../stubs/connection";
import { container } from "../stubs/container";

export const settlementTest = () => {
    describe("Game settle round", () => {
        beforeEach(() => {
            const inGameHandler = container.resolve(ConnectionHandlers.InGameHandler);
            inGameHandler.handle();
        });
        it("settlement store should has finish info", () => {
            // arrange
            const settlementStore = container.resolve(SettlementStore);
            settlementStore.roundId = 0;
            settlementStore.result = {};
            settlementStore.settlementResult = {};
            const finish = {
                roundId: 1,
                result: { choice1: 1, choice2: 2 },
                settlementResult: { choice1: false, choice2: true },
            };

            // act
            EmitEventToGameClient({ finish });

            // assert
            expect(settlementStore.roundId).toBe(finish.roundId);
            expect(settlementStore.result).toEqual(finish.result);
            expect(settlementStore.settlementResult).toEqual(finish.settlementResult);
        });

        it("settlement status store should has data", () => {
            // arrange
            const settlementStatusStore = container.resolve(SettlementStatusStore);
            settlementStatusStore.bet = 0;
            settlementStatusStore.win = false;
            const status = { win: true, bet: 20, winningByChoices: { choice1: 20 } };

            // act
            EmitEventToGameClient({ status });

            // assert
            expect(settlementStatusStore.bet).toBe(status.bet);
            expect(settlementStatusStore.win).toBe(status.win);
            expect(settlementStatusStore.winningByChoices).toEqual(status.winningByChoices);
        });
    });
};
