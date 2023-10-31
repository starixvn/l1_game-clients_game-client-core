import { stub } from "jest-auto-stub";
import { PromotionModel } from "../../../../src/notification";
import { BoostedOddsConstant, BoostedOddsModel, BoostedOddsStore } from "../../../../src/notification/boosted-odds/boosted-odds-store";
import { observable, makeObservable, computed } from "mobx";

jest.mock("mobx", () => ({
    observable: jest.fn(),
    makeObservable: jest.fn(),
}));

describe("BoostedOddsStore", () => {
    let store: BoostedOddsStore;

    beforeEach(() => {
        store = new BoostedOddsStore();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test("constructor should call makeObservable with the correct properties", () => {
        expect(makeObservable).toHaveBeenCalledWith(store, {
            isLoadedPrefab: observable,
            isLoadingIcon: observable,
            promotions: observable,
            popupCounter: observable,
            boostedOddsCounter: observable,
            shouldAddBoostedOddPrefab: computed,
        });
    });

    describe("setPromotionModels", () => {
        it("should set promotions correctly", () => {
            // Arrange
            const promotions: PromotionModel[] = stub<PromotionModel[]>([{ gameId: 1 }]);

            // Act
            store.setPromotionModels(promotions);

            // Assert
            expect(store.promotions).toEqual(promotions);
        });
    });

    describe("setBoostedOddsModels", () => {
        it("should set boosted odds correctly", () => {
            // Arrange
            const boostedOddses: BoostedOddsModel[] = stub<BoostedOddsModel[]>([{ gameId: 1 }]);

            // Act
            store.setBoostedOddsModels(boostedOddses);

            // Assert
            expect(store.boostedOddses).toEqual(boostedOddses);
        });
    });

    describe("increasePopupCounter", () => {
        it("should increase popup counter", () => {
            // Act
            store.increasePopupCounter();

            // Assert
            expect(store.popupCounter).toBe(1);
        });
    });

    describe("increaseBoostedOddCounter", () => {
        it("should increase boosted odds counter", () => {
            // Act
            store.increaseBoostedOddCounter();

            // Assert
            expect(store.boostedOddsCounter).toBe(1);
        });
    });

    describe("setIsLoadingIcon", () => {
        it("should set loading icon state", () => {
            // Act
            store.setIsLoadingIcon(true);

            // Assert
            expect(store.isLoadingIcon).toBe(true);
        });
    });

    describe("setIsAllowShowBoostedOddIcon", () => {
        it("should set show boosted odds icon state", () => {
            // Act
            store.setIsAllowShowBoostedOddIcon(true);

            // Assert
            expect(store.isAllowShowBoostedOddIcon).toBe(true);
        });
    });

    describe("resetBoostedOddsData()", () => {
        it("should reset boostedOdds data and set isAllowShowBoostedOddIcon to true", () => {
            // Arrange
            const isInstantVersion = false;

            // Act
            store.resetBoostedOddsData(isInstantVersion);

            // Assert
            expect(store.boostedOddses).toEqual([]);
            expect(store.isAllowShowBoostedOddIcon).toBe(true);
        });

        it("should set isInstantVersion based on the provided argument", () => {
            // Arrange
            const isInstantVersion = true;

            // Act
            store.resetBoostedOddsData(isInstantVersion);

            // Assert
            expect(store.isInstantVersion).toBe(true);
        });

        it("should set boostedOddsIconShowedTimeInMiliseconds based on the isInstantVersion argument", () => {
            // Arrange
            const isInstantVersion = true;

            // Act
            store.resetBoostedOddsData(isInstantVersion);

            // Assert
            expect(store.boostedOddsIconShowedTimeInMiliseconds).toBe(BoostedOddsConstant.timeOutIconInstant);
        });

        it("should set boostedOddsIconShowedTimeInMiliseconds based on the isInstantVersion argument", () => {
            // Arrange
            const isInstantVersion = false;

            // Act
            store.resetBoostedOddsData(isInstantVersion);

            // Assert
            expect(store.boostedOddsIconShowedTimeInMiliseconds).toBe(BoostedOddsConstant.timeOutIconDesktop);
        });
    });
    describe("shouldAddBoostedOddPrefab", () => {
        it("returns true when boostedOddsCounter is equal to BoostedOddsConstant.loadPrefabIndex", () => {
            // Arrange
            store.boostedOddsCounter = BoostedOddsConstant.loadPrefabIndex;

            // Act
            const result = store.shouldAddBoostedOddPrefab;

            // Assert
            expect(result).toBe(true);
        });

        it("returns false when boostedOddsCounter is not equal to BoostedOddsConstant.loadPrefabIndex", () => {
            // Arrange
            store.boostedOddsCounter = 0;

            // Act
            const result = store.shouldAddBoostedOddPrefab;

            // Assert
            expect(result).toBe(false);
        });
    });

    describe("setIsLoadedPrefab", () => {
        const data = [true, false];
        test.each(data)("should set isLoadedPrefab correctly", (inputedValue) => {
            store.setIsLoadedPrefab(inputedValue);
            expect(store.isLoadedPrefab).toBe(inputedValue);
        });
    });
});
