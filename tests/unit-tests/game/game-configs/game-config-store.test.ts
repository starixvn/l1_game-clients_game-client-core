import { makeAutoObservable } from "mobx";
import { GameConfigStore } from "../../../../src/game/game-configs";
import { GameServiceMessage } from "../../../../src/shared";

jest.mock("mobx");

describe("GameConfigStore", () => {
    describe("constructor", () => {
        it("should call makeAutoObservable", () => {
            // act
            const store = new GameConfigStore();

            // assert
            expect(makeAutoObservable).toHaveBeenCalledWith(store);
        });
    });

    describe("setGameConfigs", () => {
        it("should not set store configuration when gameConfigs empty", () => {
            // arrange
            const gameConfigs = new GameServiceMessage.GameConfigs();
            const store = new GameConfigStore();

            // act
            store.setGameConfigs(gameConfigs);

            // assert
            expect(store.minBet).toBe(0);
            expect(store.maxBet).toBe(0);
            expect(store.maxBetPerChoices).toEqual({});
            expect(store.chips).toEqual([]);
            expect(store.stakeLevels).toEqual([]);
            expect(store.odds).toEqual({});
            expect(store.enableFreeBet).toBe(false);
            expect(store.originalOdds).toBeNull();
            expect(store.boostedChoices).toEqual([]);
        });
        it("should set store configuration when gameConfigs has value", () => {
            // arrange
            const gameConfigs: GameServiceMessage.GameConfigs = {
                minBet: 10,
                maxBet: 2000,
                maxBetPerChoices: { even: 1000, odd: 1000 },
                chips: ["10", "50", "100", "200"],
                stakeLevels: [],
                odds: { even: 1.96, odd: 1.96 },
                enableFreeBet: false,
                originalOdds: { even: 1.96, odd: 1.96 },
                boostedChoices: { even: 1.97, odd: 1.97 },
            };

            const store = new GameConfigStore();

            // act
            store.setGameConfigs(gameConfigs);

            // assert
            expect(store.minBet).toBe(10);
            expect(store.maxBet).toBe(2000);
            expect(store.maxBetPerChoices).toEqual({ even: 1000, odd: 1000 });
            expect(store.chips).toEqual(["10", "50", "100", "200"]);
            expect(store.stakeLevels).toEqual([]);
            expect(store.odds).toEqual({ even: 1.96, odd: 1.96 });
            expect(store.enableFreeBet).toBe(false);
            expect(store.originalOdds).toEqual({ even: 1.96, odd: 1.96 });
            expect(store.boostedChoices).toEqual({ even: 1.97, odd: 1.97 });
        });
    });
});
