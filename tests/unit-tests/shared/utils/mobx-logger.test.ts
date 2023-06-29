import * as mobxLogger from "mobx-logger";
import { initMobxLogger } from "../../../../src/shared/utils";
import { StorageManager } from "../../../../src/shared/utils/storage-manager";

describe("initMobxLogger", () => {
    beforeEach(() => {
        // Clear the mock implementation and reset any mock calls/instances
        jest.clearAllMocks();
    });

    test("should enable logging if enabledMobxDebug is true", () => {
        // Arrange
        StorageManager.get = jest.fn().mockReturnValue(true);
        const enableLoggingSpy = jest.spyOn(mobxLogger, "enableLogging");

        // Act
        initMobxLogger();

        // Assert
        expect(StorageManager.get).toHaveBeenCalledWith("enabledMobxDebug");
        expect(enableLoggingSpy).toHaveBeenCalled();
    });

    test("should not enable logging if enabledMobxDebug is false", () => {
        // Arrange
        StorageManager.get = jest.fn().mockReturnValue(false);
        const enableLoggingSpy = jest.spyOn(mobxLogger, "enableLogging");

        // Act
        initMobxLogger();

        // Assert
        expect(StorageManager.get).toHaveBeenCalledWith("enabledMobxDebug");
        expect(enableLoggingSpy).not.toHaveBeenCalled();
    });

    test("should handle error when accessing StorageManager", () => {
        // Arrange
        StorageManager.get = jest.fn().mockImplementation(() => {
            throw new Error("Mock error");
        });

        // Act & Assert
        expect(() => {
            initMobxLogger();
        }).not.toThrow();
    });
});
