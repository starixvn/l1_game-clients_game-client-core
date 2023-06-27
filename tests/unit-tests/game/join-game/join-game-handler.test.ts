import { stub } from "jest-auto-stub";
import { JoinGameHandler, JoinGameStore } from "../../../../src/game/join-game";

describe("JoinGameHandler", () => {
    let handler: JoinGameHandler;
    let joinGameStore: JoinGameStore;

    beforeEach(() => {
        joinGameStore = stub<JoinGameStore>();

        handler = new JoinGameHandler(joinGameStore);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("handle", () => {
        it("should stop the round runner, round time store and disconnect store", () => {
            // Arrange
            const toGame = "SeDie";

            // Act
            handler.handle(toGame);

            // Assert
            expect(joinGameStore.toGame).toEqual({ name: toGame });
        });
    });
});
