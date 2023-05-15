import { SettingResponse } from "sc-user-service-client/dist/setting";
import { AuthStore, UserService } from "../../../../src/auth";
import { ChipSettingHandler, ChipSettingStore } from "../../../../src/game/chips";
import { siteConfigs } from "../../container.test";

describe("ChipSettingHandler", () => {
    let userServiceMock: UserService;
    let chipSettingStoreMock: ChipSettingStore;
    let chipSettingHandler: ChipSettingHandler;
    let authStoreMock: AuthStore;

    beforeEach(() => {
        userServiceMock = new UserService(siteConfigs);
        userServiceMock.getChipSetting = jest.fn().mockResolvedValue({
            success: true,
            chips: [
                { value: 1, color: "#ffffff" },
                { value: 5, color: "#ff0000" },
                { value: 10, color: "#00ff00" },
            ],
        });

        chipSettingStoreMock = new ChipSettingStore();
        chipSettingStoreMock.updateChipColor = jest.fn();
        authStoreMock = new AuthStore();
        authStoreMock.session = "abc123";
        authStoreMock.username = "testuser";
        chipSettingHandler = new ChipSettingHandler(userServiceMock, chipSettingStoreMock, authStoreMock);
    });

    it("can handle chip settings", async () => {
        // Act
        await chipSettingHandler.handle();

        // Assert
        expect(userServiceMock.getChipSetting).toHaveBeenCalledTimes(1);
        expect(userServiceMock.getChipSetting).toHaveBeenCalledWith(authStoreMock.session, authStoreMock.username);
        expect(chipSettingStoreMock.updateChipColor).toHaveBeenCalledTimes(1);
        expect(chipSettingStoreMock.updateChipColor).toHaveBeenCalledWith([
            { value: 1, color: "#ffffff" },
            { value: 5, color: "#ff0000" },
            { value: 10, color: "#00ff00" },
        ]);
    });

    it("should call updateChipColor with empty array if no chip setting data is returned from the API", async () => {
        // Arrange
        jest.spyOn(userServiceMock, "getChipSetting").mockResolvedValue({} as SettingResponse);

        // Act
        await chipSettingHandler.handle();

        // Assert
        expect(chipSettingStoreMock.updateChipColor).toHaveBeenCalledWith([]);
    });
});
