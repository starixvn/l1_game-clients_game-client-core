import { GameConfigStore } from "../../../../src/game/game-configs";
import { RoundStore, RoundUIHandlers } from "../../../../src/game/rounds";
import { MainPlayerStore } from "../../../../src/players";
describe("RoundUIHandlers tests", () => {
    describe("SetRoundId", () => {
        it("should set roundId to expected in round store", () => {
            // arrange
            const gameConfigStore = new GameConfigStore();
            const mainPlayerStore = new MainPlayerStore();
            const store = new RoundStore(gameConfigStore, mainPlayerStore);
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
            const mainPlayerStore = new MainPlayerStore();
            const store = new RoundStore(gameConfigStore, mainPlayerStore);
            store.resetForNewRound = jest.fn();
            const handler = new RoundUIHandlers.ResetRoundStore(store);

            // act
            handler.handle();

            // assert
            expect(store.resetForNewRound).toHaveBeenCalled();
        });
    });
});
