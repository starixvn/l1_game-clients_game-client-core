import { BetHandler } from "../../../../src/game/bets";
import { PlayerStore } from "../../../../src/players";
import { GameClientEmitMessage, Mediator } from "../../../../src/shared";
import { gameSettings } from "../../container.test";
import { BetStore } from "./../../../../src/game/bets/bet-store";
import { ConnectionStore } from "./../../../../src/game/connection/connection-store";
import { OrientationStore } from "./../../../../src/game/orientation/orientation-store";

describe("BetHandler test", () => {
    let connectionStore: ConnectionStore;
    let betStore: BetStore;
    let playerStore: PlayerStore;
    let orientationStore: OrientationStore;

    beforeEach(() => {
        playerStore = new PlayerStore();
        connectionStore = new ConnectionStore(new Mediator(), gameSettings);
        betStore = new BetStore();
        orientationStore = new OrientationStore();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("handle", () => {
        it("should call send bet data", () => {
            // Arrange
            const betHandler = new BetHandler(connectionStore, betStore, playerStore, orientationStore);
            const betChoice = "even";
            connectionStore.send = jest.fn();

            // Act
            betHandler.handle(betChoice);

            // Assert
            const amount = betStore.amount;
            const freeBet = betStore.freebetEnabled && amount <= playerStore.scoin;
            const betData = {
                m: orientationStore.m,
                username: playerStore.name,
                betChoice,
                amount,
                freeBet,
            };
            expect(connectionStore.send).toBeCalledWith(GameClientEmitMessage.Bet.eventName, betData);
        });
    });
});
