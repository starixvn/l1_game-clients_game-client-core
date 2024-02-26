import { stub } from "jest-auto-stub";
import { ProvablyFairHandler } from "../../../../src/game-crash/provably-fair/provably-fair-handler";
import { ProvablyFairStore } from "../../../../src/game-crash/provably-fair/provably-fair-store";
import { GameUserSettingHandler } from "../../../../src/game/game-user-settings/game-user-setting-handler";
import { GameUserSettingStore } from "../../../../src/game/game-user-settings/game-user-setting-store";
import { RoundPFHandler } from "../../../../src/game/round-pf/round-pf-handler";
import { RoundTimeStore } from "../../../../src/game/rounds/round-time-store";

describe("ProvablyFairHandler", () => {
    let provablyFairHandler: ProvablyFairHandler;
    let provablyFairStore: ProvablyFairStore;
    let roundTimeStore: RoundTimeStore;
    let gameUserSettingStore: GameUserSettingStore;
    let gameUserSettingHandler: GameUserSettingHandler;
    let roundPFHandler: RoundPFHandler;

    beforeAll(() => {
        provablyFairStore = stub<ProvablyFairStore>();
        roundTimeStore = stub<RoundTimeStore>();
        gameUserSettingStore = stub<GameUserSettingStore>();
        gameUserSettingHandler = stub<GameUserSettingHandler>();
        roundPFHandler = stub<RoundPFHandler>();
    });
    beforeEach(() => {
        jest.clearAllMocks();
        provablyFairHandler = new ProvablyFairHandler(
            provablyFairStore,
            roundTimeStore,
            gameUserSettingStore,
            gameUserSettingHandler,
            roundPFHandler
        );
    });

    describe("handleClientSeedPopup", () => {
        it("when openClientSeedPopup is true", () => {
            //Arrange
            const openClientSeedPopup = true;
            provablyFairStore.openClientSeedPopup = !openClientSeedPopup;

            //Act
            provablyFairHandler.handleClientSeedPopup(openClientSeedPopup);

            //Assert
            expect(provablyFairStore.openClientSeedPopup).toEqual(true);
        });
    });

    describe("clientSeedGenerationMode", () => {
        it("when randomClientSeedEnabled is false", () => {
            //Arrange
            const randomClientSeedEnabled = false;
            provablyFairStore.randomClientSeedEnabled = !randomClientSeedEnabled;

            //Act
            provablyFairHandler.clientSeedGenerationMode(randomClientSeedEnabled);

            //Assert
            expect(provablyFairStore.randomClientSeedEnabled).toEqual(false);
        });

        it("call gameUserSettingHandler.saveTempStorage ", () => {
            //Arrange
            const randomClientSeedEnabled = false;
            provablyFairStore.randomClientSeedEnabled = !randomClientSeedEnabled;

            //Act
            provablyFairHandler.clientSeedGenerationMode(randomClientSeedEnabled);

            //Assert
            expect(gameUserSettingHandler.savePermanentStorage).toBeCalled();
        });
    });

    describe("saveManualClientSeed", () => {
        it("test assign value correctly", () => {
            //Arrange
            const manualClientSeed = "123";
            provablyFairStore.manualClientSeed = "";

            //Act
            provablyFairHandler.saveManualClientSeed(manualClientSeed);

            //Assert
            expect(provablyFairStore.manualClientSeed).toEqual("123");
        });
    });
});
