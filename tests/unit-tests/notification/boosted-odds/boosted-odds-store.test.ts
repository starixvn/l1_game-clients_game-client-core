import { stub } from "jest-auto-stub";
import { PromotionModel } from "../../../../src/notification";
import { BoostedOddsModel, BoostedOddsStore } from "../../../../src/notification/boosted-odds/boosted-odds-store";

describe("BoostedOddsStore", () => {
    let store: BoostedOddsStore;

    beforeEach(() => {
        store = new BoostedOddsStore();
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
});
