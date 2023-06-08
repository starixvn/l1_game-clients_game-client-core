import { GameConfigStore } from "../../../../src/game/game-configs";
import { RoundStore } from "../../../../src/game/rounds";
import { PlayerStore } from "../../../../src/players";

const gameConfig = {
    minBet: 1,
    maxBet: 40000,
    maxBetPerChoices: {
        even: 40000,
        odd: 40000,
        red3: 40000,
        white3: 40000,
        red4: 4000,
        white4: 4000,
        red2: 40000,
    },
    chips: ["1", "5", "10", "50", "100", "200", "500", "1000", "2000", "3000", "5000", "10000", "20000"],
    stakeLevels: [],
    odds: {
        even: 1.96,
        odd: 1.96,
        red3: 3.75,
        white3: 3.75,
        red4: 14.4,
        white4: 14.4,
        red2: 2.4,
    },
    enableFreeBet: false,
};
describe("RoundStore", () => {
    let roundStore: RoundStore;
    let gameConfigStore: GameConfigStore;
    let playerStore: PlayerStore;

    beforeEach(() => {
        gameConfigStore = new GameConfigStore();
        gameConfigStore.setGameConfigs(gameConfig);
        playerStore = new PlayerStore();
        roundStore = new RoundStore(gameConfigStore, playerStore);
    });

    it("should have initial values", () => {
        // Assert
        expect(roundStore.roundId).toEqual(0);
        expect(roundStore.ownBets).toEqual({});
        expect(roundStore.totalBets).toEqual({});
        expect(roundStore.resultHash).toEqual({});
    });

    it("should have minBet and maxBet from gameConfigStore and playerStore", () => {
        expect(roundStore.minBet).toEqual(Math.max(gameConfigStore.minBet, playerStore.stakeLevel.minBet));
        expect(roundStore.maxBet).toEqual(Math.min(gameConfigStore.maxBet, playerStore.stakeLevel.maxBet));
    });

    it("total bets should be converted rate", () => {
        // arrange
        playerStore.rate = 0.5;
        roundStore.totalBets = { even: 10, red4: 20, red3: 5 };

        // act
        const actual = roundStore.totalBets;

        // assert
        expect(actual).toEqual({ even: 5, red4: 10, red3: 2.5 });
    });

    it("resetForNewRound() should reset ownBets and totalBets", () => {
        // Arrange
        roundStore.ownBets = { "option A": 10, "option B": 20 };
        roundStore.totalBets = { "option A": 50, "option B": 70 };

        // Act
        roundStore.resetForNewRound();

        // Assert
        expect(roundStore.ownBets).toEqual({});
        expect(roundStore.totalBets).toEqual({});
    });

    it("resetRoundStore() should reset ownBets, totalBets, and resultHash", () => {
        // Arrange
        roundStore.ownBets = { even: 10, red4: 20 };
        roundStore.totalBets = { even: 10, red4: 20 };
        roundStore.resultHash = {
            rawValue: "rawTest",
            extraInfos: "infoTest",
            hashValue: "hashTest",
        };

        // Act
        roundStore.resetRoundStore();

        // Assert
        expect(roundStore.ownBets).toEqual({});
        expect(roundStore.totalBets).toEqual({});
        expect(roundStore.resultHash).toEqual({});
    });
});
