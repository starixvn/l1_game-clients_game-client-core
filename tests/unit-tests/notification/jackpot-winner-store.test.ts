import { stub } from "jest-auto-stub";
import { MainPlayerStore } from "../../../src/players/main-player-store";
import { JackpotWinnerStore } from "./../../../src/notification/jackpot-winner-store";

describe("JackpotWinnerStore tests", () => {
    let store: JackpotWinnerStore;
    let mainPlayerStore: MainPlayerStore;

    beforeEach(() => {
        mainPlayerStore = stub<MainPlayerStore>();
        store = new JackpotWinnerStore(mainPlayerStore);
    });

    describe("setJackpotWinner", () => {
        const jackpotWinner = {
            gameId: 1,
            winnerName: "player1",
            amount: 100,
            pool: 1,
        };
        describe("when invalid jackpot notification", () => {
            it("should not set jackpotWin when player disable jackpot games", () => {
                // arrange
                mainPlayerStore.disableJackpotGames = true;

                // act
                store.setJackpotWinner(jackpotWinner);

                // assert
                expect(store.jackpotWinner).toBeNull();
            });

            it("should not set jackpotWin when player not offer game", () => {
                // arrange
                mainPlayerStore.disableJackpotGames = false;
                mainPlayerStore.offerGames = [{ gameId: 2 }, { gameId: 3 }, { gameId: 4 }];

                // act
                store.setJackpotWinner(jackpotWinner);

                // assert
                expect(store.jackpotWinner).toBeNull();
            });

            it("should not set jackpotWin when player is jackpot winner", () => {
                // arrange
                mainPlayerStore.disableJackpotGames = false;
                mainPlayerStore.offerGames = [{ gameId: 1 }];
                mainPlayerStore.name = "player1";

                // act
                store.setJackpotWinner(jackpotWinner);

                // assert
                expect(store.jackpotWinner).toBeNull();
            });
        });

        describe("when valid jackpot notification", () => {
            it("should set jackpotWinner", () => {
                //arrange
                mainPlayerStore.disableJackpotGames = false;
                mainPlayerStore.offerGames = [{ gameId: 1 }];
                mainPlayerStore.name = "player2";
                mainPlayerStore.rate = 1;

                // act
                store.setJackpotWinner(jackpotWinner);

                // assert
                expect(store.jackpotWinner).toEqual(jackpotWinner);
            });
        });
    });

    describe("get jackpotWinner", () => {
        it("should convert rate before return value", () => {
            //arrange
            const jackpotWinner = {
                gameId: 1,
                winnerName: "player1",
                amount: 100,
                pool: 1,
            };
            mainPlayerStore.disableJackpotGames = false;
            mainPlayerStore.offerGames = [{ gameId: 1 }];
            mainPlayerStore.name = "player2";
            mainPlayerStore.rate = 0.5;
            store.setJackpotWinner(jackpotWinner);

            // act
            const actual = store.jackpotWinner;

            // assert
            expect(actual.winnerName).toBe(jackpotWinner.winnerName);
            expect(actual.amount).toBe(200);
            expect(actual.gameId).toBe(jackpotWinner.gameId);
            expect(actual.pool).toBe(jackpotWinner.pool);
        });
    });
});
