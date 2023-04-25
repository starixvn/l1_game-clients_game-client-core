import { GameSetting } from "../../../../src/game/game-configs";
import { RoundTimeStore } from "../../../../src/game/rounds/round-time-store";
import { GameServiceMessage } from "../../../../src/shared";
import { gameSettings } from "../../container.test";
import { RoundRunningHandlers } from "./../../../../src/game/rounds/round-running-handlers";

describe("RoundRunningHandlers", () => {
    let roundRunningHandlers: RoundRunningHandlers;
    let roundTimeStore: RoundTimeStore;
    let gameSetting: GameSetting;

    beforeEach(() => {
        gameSetting = new GameSetting();
        gameSetting.name = gameSettings.name;
        gameSetting.durations = gameSettings.durations;
        roundRunningHandlers = new RoundRunningHandlers(roundTimeStore, gameSetting);
    });

    afterEach(() => {
        jest.clearAllMocks();
        clearInterval(roundRunningHandlers.runnerId);
    });

    it("should start the runner when the correct game is sent", () => {
        // Arrange
        roundRunningHandlers.startRunner = jest.fn();
        const inGame = "sedie";

        // Act
        roundRunningHandlers.handleToGame(inGame);

        // Assert
        expect(roundRunningHandlers.startRunner).toHaveBeenCalledTimes(1);
    });

    it("should not start the runner when the wrong game is sent", () => {
        // Arrange
        roundRunningHandlers.startRunner = jest.fn();

        // Act
        roundRunningHandlers.handleToGame("DragonTiger");

        // Assert
        expect(roundRunningHandlers.startRunner).toHaveBeenCalledTimes(0);
    });

    describe("startRunner", () => {
        it("should set an interval and start the timer", () => {
            // Act
            roundRunningHandlers.startRunner();

            // Assert
            expect(roundRunningHandlers.runnerId).not.toBeNull();
        });

        it("should stop the timer before starting a new one", () => {
            // Arrange
            jest.spyOn(roundRunningHandlers, "stopRunner");

            // Act
            roundRunningHandlers.startRunner();

            // Assert
            expect(roundRunningHandlers.stopRunner).toHaveBeenCalled();
        });

        it("should call countdown every second", () => {
            // Arrange
            roundTimeStore = new RoundTimeStore(gameSetting);
            roundTimeStore.calculateRoundStatus = jest.fn();
            jest.spyOn(roundTimeStore, "countdown");

            // Act
            roundRunningHandlers.startRunner();

            // Assert
            setTimeout(() => {
                expect(roundTimeStore.countdown).toHaveBeenCalled();
            }, 1000);
        });
    });

    it("should stop the runner when stopRunner is called", () => {
        // Arrange
        roundRunningHandlers.runnerId = setTimeout(() => {}, 0) as any;
        jest.spyOn(window, "clearInterval");

        // Act
        roundRunningHandlers.stopRunner();

        // Assert
        expect(window.clearInterval).toHaveBeenCalledWith(roundRunningHandlers.runnerId);
    });

    describe("eventHandleList", () => {
        it("should be equal expected", () => {
            // Arrange
            const expected = [
                {
                    name: GameServiceMessage.toGame,
                    handle: roundRunningHandlers.handleToGame,
                },
            ];

            // Assert
            expect(roundRunningHandlers.eventHandleList).toEqual(expected);
        });
    });
});
