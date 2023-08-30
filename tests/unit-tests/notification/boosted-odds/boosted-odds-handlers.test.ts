import { stub } from "jest-auto-stub";
import { AppStore } from "../../../../src/app";
import { BoostedOddsModel, BoostedOddsStore, PromotionModel } from "../../../../src/notification";
import { MainPlayerStore } from "../../../../src/players";
import { BoostedOddsPromotionsHandlers } from "../../../../src/notification/boosted-odds/boosted-odds-handlers";

// Mocks and Stubs

describe("Booted Odds tests", () => {
    describe("PromotionHandlers", () => {
        let handlers: BoostedOddsPromotionsHandlers.PromotionHandlers;
        let mockedBoostedOddsStore: BoostedOddsStore;
        let mockedMainPlayerStore: MainPlayerStore;

        beforeEach(() => {
            jest.clearAllMocks();
            mockedBoostedOddsStore = stub<BoostedOddsStore>();
            mockedMainPlayerStore = stub<MainPlayerStore>();
        });

        it("handle method should set promotion models", () => {
            // Arrange
            const mockPromotions: PromotionModel[] = stub<PromotionModel[]>([{ gameId: 1 }]);
            mockedMainPlayerStore = stub<MainPlayerStore>({ offerGames: [{ gameId: 1 }] });
            handlers = new BoostedOddsPromotionsHandlers.PromotionHandlers(mockedBoostedOddsStore, mockedMainPlayerStore);

            // Act
            handlers.handle(mockPromotions);

            // Assert
            expect(mockedBoostedOddsStore.setPromotionModels).toHaveBeenCalledWith([mockPromotions[0]]);
        });

        it("handle method should not set promotion models if no matching games", () => {
            // Arrange
            const mockPromotions: PromotionModel[] = stub<PromotionModel[]>([{ gameId: 1 }]);
            mockedMainPlayerStore = stub<MainPlayerStore>({ offerGames: [{ gameId: 3 }] });
            handlers = new BoostedOddsPromotionsHandlers.PromotionHandlers(mockedBoostedOddsStore, mockedMainPlayerStore);

            // Act
            handlers.handle(mockPromotions);

            // Assert
            expect(mockedBoostedOddsStore.setPromotionModels).not.toHaveBeenCalled();
        });
    });
});
