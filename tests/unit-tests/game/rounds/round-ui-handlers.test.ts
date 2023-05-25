import { GameConfigStore } from "../../../../src/game/game-configs";
import { RoundStore, RoundUIHandlers } from "../../../../src/game/rounds";
import { PlayerStore } from "../../../../src/players";
describe("RoundUIHandlers tests", () => {
    describe("SetRoundId", () => {
        it("should set roundId to expected in round store", () => {
            // arrange
            const gameConfigStore = new GameConfigStore();
            const playerStore = new PlayerStore();
            const store = new RoundStore(gameConfigStore, playerStore);
            store.roundId = 0;
            const handler = new RoundUIHandlers.SetRoundId(store);

            // act
            handler.handle(10);

            // assert
            expect(store.roundId).toBe(10);
        });
    });

    describe("ResetRoundStore", () => {
        it("should call resetFroNewRound in RoundStore", () => {
            // arrange
            const gameConfigStore = new GameConfigStore();
            const playerStore = new PlayerStore();
            const store = new RoundStore(gameConfigStore, playerStore);
            store.resetForNewRound = jest.fn();
            const handler = new RoundUIHandlers.ResetRoundStore(store);

            // act
            handler.handle();

            // assert
            expect(store.resetForNewRound).toHaveBeenCalled();
        });
    });
});
