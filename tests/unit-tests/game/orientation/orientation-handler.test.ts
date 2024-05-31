import { stub } from "jest-auto-stub";
import { GameServiceMessage } from "../../../../src/exports";
import { ChipStore } from "../../../../src/game/chips";
import { Orientation, OrientationHandler, OrientationStore } from "../../../../src/game/orientation";
import { RoundHistoryStore } from "../../../../src/game/round-histories";
import { SettlementStore } from "../../../../src/game/settlements";
describe("OrientationHandler", () => {
    let orientationStore: OrientationStore;
    let settlementStore: SettlementStore;
    let roundHistoryStore: RoundHistoryStore;
    let chipStore: ChipStore;
    let orientationHandler: OrientationHandler;
    beforeEach(() => {
        orientationStore = stub<OrientationStore>();
        settlementStore = stub<SettlementStore>();
        roundHistoryStore = stub<RoundHistoryStore>();
        chipStore = stub<ChipStore>();
        orientationHandler = new OrientationHandler(orientationStore, settlementStore, roundHistoryStore, chipStore);
    });

    describe("changeOrientation", () => {
        it("should swap orientation", () => {
            // Arrange
            orientationStore.orientation = Orientation.Landscape;

            // Act
            orientationHandler.changeOrientation();

            // Assert
            expect(orientationStore.orientation).toEqual(Orientation.Portrait);
        });

        it("should call handleLastSettlement", () => {
            // Arrange
            const methodSpy = jest.spyOn(orientationHandler, "handleLastSettlement");

            // Act
            orientationHandler.changeOrientation();

            // Assert
            expect(methodSpy).toBeCalled();
        });

        it("should call reactiveClientChips", () => {
            // Arrange
            const methodSpy = jest.spyOn(orientationHandler, "reactiveClientChips");

            // Act
            orientationHandler.changeOrientation();

            // Assert
            expect(methodSpy).toBeCalled();
        });
    });

    describe("handleLastSettlement", () => {
        it("should call insertNewRound when not finished show result", () => {
            // Arrange
            settlementStore.currentFinish = stub<GameServiceMessage.Finish>();
            settlementStore.isFinishedShowResult = false;

            // Act
            orientationHandler.handleLastSettlement();

            // Assert
            expect(roundHistoryStore.insertNewRound).toBeCalled();
        });
    });

    describe("reactiveClientChips", () => {
        it("should granted clientChips by itself ", () => {
            // Arrange
            const current = {
                even: { 10: 2, 50: 3 },
            };
            chipStore.clientChips = current;

            // Act
            orientationHandler.reactiveClientChips();

            // Assert
            expect(chipStore.clientChips).not.toBe(current);
            expect(chipStore.clientChips).toEqual(current);
        });
    });
});
