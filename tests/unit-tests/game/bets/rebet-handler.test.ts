import { stub } from "jest-auto-stub";
import { StorageManager } from "../../../../src/exports";
import { ReBetHandlers, ReBetStore } from "../../../../src/game/bets";
import { GameClientEmitMessage } from "../../../../src/shared";
import { BetHandler } from "./../../../../src/game/bets/bet-handler";
import { BetStore } from "./../../../../src/game/bets/bet-store";
import { ConnectionStore } from "./../../../../src/game/connection/connection-store";
import { OrientationStore } from "./../../../../src/game/orientation/orientation-store";

describe("ReBetHandlers", () => {
    describe("ReBetHandler", () => {
        let connectionStore: ConnectionStore;
        let orientationStore: OrientationStore;
        let betHandler: BetHandler;
        let reBetHandler: ReBetHandlers.ReBetHandler;
        let betStore: BetStore;

        beforeEach(() => {
            connectionStore = stub<ConnectionStore>();
            betStore = stub<BetStore>();
            orientationStore = stub<OrientationStore>();
            betHandler = stub<BetHandler>();

            reBetHandler = new ReBetHandlers.ReBetHandler(connectionStore, betStore, orientationStore, betHandler);
        });

        test("handle - should do nothing if betHandler.isInPhasePreventBet returns true", () => {
            // Arrange
            jest.spyOn(betHandler, "isInPhasePreventBet").mockReturnValue(true);

            // Act
            reBetHandler.handle();

            // Assert
            expect(betHandler.isInPhasePreventBet).toHaveBeenCalled();
        });

        test("handle - should show warning and return if betStore.isProcessingBet is truthy", () => {
            // Arrange
            jest.spyOn(betHandler, "isInPhasePreventBet").mockReturnValue(false);
            betStore.isProcessingBet = true;
            const showWarningProcessingBetMock = jest.spyOn(betHandler, "showWarningProcessingBet");

            // Act
            reBetHandler.handle();

            // Assert
            expect(showWarningProcessingBetMock).toHaveBeenCalled();
        });

        test("handle - should set betStore.isProcessingBet to true and send the correct message", () => {
            // Arrange
            jest.spyOn(betHandler, "isInPhasePreventBet").mockReturnValue(false);
            betStore.isProcessingBet = false;
            const sendMock = jest.spyOn(connectionStore, "send");

            // Act
            reBetHandler.handle();

            // Assert
            expect(betStore.isProcessingBet).toBe(true);
            expect(sendMock).toHaveBeenCalledWith(GameClientEmitMessage.reBet, {
                m: orientationStore.m,
            });
        });
    });

    describe("LoadRuleReBetStorage", () => {
        let loadRuleReBetStorage: ReBetHandlers.LoadRuleReBetStorage;
        let reBetStore: ReBetStore;

        beforeEach(() => {
            reBetStore = stub<ReBetStore>();
            loadRuleReBetStorage = new ReBetHandlers.LoadRuleReBetStorage(reBetStore);
        });

        test("handle - should set reBetStore.ruleShowReBet if storageReBet.roundId exists", () => {
            // Arrange
            const storageReBet = {
                roundId: "123",
            };
            jest.spyOn(StorageManager, "get").mockReturnValue(storageReBet);

            // Act
            loadRuleReBetStorage.handle();

            // Assert
            expect(StorageManager.get).toHaveBeenCalledWith(reBetStore.keyStorageReBet);
            expect(reBetStore.ruleShowReBet).toEqual(storageReBet);
        });

        test("handle - should not set reBetStore.ruleShowReBet if storageReBet.roundId is falsy", () => {
            // Arrange
            const storageReBet = {
                roundId: null,
            };
            jest.spyOn(StorageManager, "get").mockReturnValue(storageReBet);

            // Act
            loadRuleReBetStorage.handle();

            // Assert
            expect(StorageManager.get).toHaveBeenCalledWith(reBetStore.keyStorageReBet);
        });
    });
});
