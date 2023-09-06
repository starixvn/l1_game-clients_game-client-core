import { stub } from "jest-auto-stub";
import { PromotionModel } from "../../../../src/notification";
import { BoostedOddsModel, BoostedOddsStore } from "../../../../src/notification/boosted-odds/boosted-odds-store";
import { observable, makeObservable } from "mobx";

jest.mock("mobx", () => ({
    observable: jest.fn(),
    makeObservable: jest.fn(),
}));

describe("BoostedOddsStore", () => {
    let store: BoostedOddsStore;

    beforeEach(() => {
        store = new BoostedOddsStore();
    });

    test("constructor should call makeObservable with the correct properties", () => {
        expect(makeObservable).toHaveBeenCalledWith(store, {
            isLoadingIcon: observable,
            promotions: observable,
            popupCounter: observable,
            boostedOddsCounter: observable,
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

    describe("resetBoostedOddsData", () => {
        it(" should reset boostedOddses and isAllowShowBoostedOddIcon", () => {
            // Arrange
            store.boostedOddses = [];
            store.isAllowShowBoostedOddIcon = false;

            // Act
            store.resetBoostedOddsData();

            // Assert
            expect(store.boostedOddses).toEqual([]);
            expect(store.isAllowShowBoostedOddIcon).toBe(true);
        });
    });
});
