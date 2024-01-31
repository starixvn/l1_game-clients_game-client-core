import { stub } from "jest-auto-stub";
import { ProvablyFairHandler } from "../../../../src/game-crash/provably-fair/provably-fair-handler";
import { ProvablyFairStore } from "../../../../src/game-crash/provably-fair/provably-fair-store";
import { RoundTimeStore } from "../../../../src/game/rounds/round-time-store";

describe("ProvablyFairHandler", () => {
    let provablyFairHandler: ProvablyFairHandler;
    let provablyFairStore: ProvablyFairStore;
    let roundTimeStore: RoundTimeStore;
    beforeAll(() => {
        provablyFairStore = stub<ProvablyFairStore>();
        roundTimeStore = stub<RoundTimeStore>();
    });
    beforeEach(() => {
        jest.clearAllMocks();
        provablyFairHandler = new ProvablyFairHandler(provablyFairStore, roundTimeStore);
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
            expect(provablyFairStore.openClientSeedPopup).toEqual(false);
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

    describe("changePFVerification", () => {
        it("test assign value correctly", () => {
            //Arrange
            const verification = {
                roundId: 123,
                serverSeedHash: "123abc",
                crashPoint: 2.1,
            };
            provablyFairStore.verification = {
                roundId: 234,
                serverSeedHash: "234abc",
                crashPoint: 2.1,
            };

            //Act
            provablyFairHandler.changePFVerification(verification);

            //Assert
            expect(provablyFairStore.verification).toEqual(verification);
        });
    });
});
