import { stub } from "jest-auto-stub";
import { RocketState } from "../../../../src/game-crash/game-crash-messages";
import { MultiplierStore } from "../../../../src/game-crash/multiplier/multiplier-store";
import { UserSettingStore } from "../../../../src/game/user-settings/user-setting-store";

describe("MultiplierStore", () => {
    let multiplierStore: MultiplierStore;
    let userSettingsStore: UserSettingStore;

    beforeAll(() => {
        userSettingsStore = stub<UserSettingStore>();
    });

    beforeEach(() => {
        jest.clearAllMocks();
        multiplierStore = new MultiplierStore(userSettingsStore);
    });

    describe("playSoundRocketFly", () => {
        describe("when sfxEnable is true", () => {
            beforeEach(() => {
                userSettingsStore.sfxEnable = true;
            });
            it("when rocketState is FLYING", () => {
                //Arrange
                multiplierStore.rocketState = RocketState.FLYING;

                //Act

                //Assert
                expect(multiplierStore.playSoundRocketFly).toBe(true);
            });

            it("when rocketState is not FLYING", () => {
                //Arrange
                multiplierStore.rocketState = RocketState.CRASHED;

                //Act

                //Assert
                expect(multiplierStore.playSoundRocketFly).toBe(false);
            });
        });

        describe("when sfxEnable is false", () => {
            beforeEach(() => {
                userSettingsStore.sfxEnable = false;
            });
            it("when rocketState is FLYING", () => {
                //Arrange
                multiplierStore.rocketState = RocketState.FLYING;

                //Act

                //Assert
                expect(multiplierStore.playSoundRocketFly).toBe(false);
            });

            it("when rocketState is not FLYING", () => {
                //Arrange
                multiplierStore.rocketState = RocketState.CRASHED;

                //Act

                //Assert
                expect(multiplierStore.playSoundRocketFly).toBe(false);
            });
        });
    });
});
