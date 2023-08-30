import { stub } from "jest-auto-stub";
import { PromotionModel } from "../../../../src/notification";
import { BoostedOddsStore } from "../../../../src/notification/boosted-odds/boosted-odds-store";

describe("BoostedOddsStore", () => {
    let store: BoostedOddsStore;
    beforeEach(() => {
        store = new BoostedOddsStore();
        store.promotions = [];
        store.popupCounter = 0;
        store.isLoadingIcon = false;
        store.boostedOddsCounter = 0;
    });

    describe("setData", () => {
        it("should set promotions correctly", () => {
            // Arrange
            const promotionModel: PromotionModel[] = stub<PromotionModel[]>([{ gameId: 1 }]);

            // Act
            store.setPromotionModels(promotionModel);

            // Assert
            expect(store.promotions).toEqual(promotionModel);
        });
    });

    describe("increasePopupCounter", () => {
        it("should increment popupCounter by 1", () => {
            // Act
            store.increasePopupCounter();

            // Assert that popupCounter is incremented
            expect(store.popupCounter).toBe(1);
        });
    });

    describe("boostedOddsCounter", () => {
        it("should get and set boostedOddsCounter", () => {
            // Arrange
            store.boostedOddsCounter = 5;

            // Act
            const counter = store.boostedOddsCounter;

            // Assert
            expect(counter).toBe(5);
        });
    });

    describe("setIsLoadingIcon", () => {
        it("should set isLoadingIcon correctly", () => {
            // Act
            store.setIsLoadingIcon(true);

            // Assert
            expect(store.isLoadingIcon).toBe(true);
        });
    });
});
