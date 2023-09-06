import { stub } from "jest-auto-stub";
import { AppStore } from "../../../../src/app";
import { BoostedOddsModel, BoostedOddsStore, PromotionModel } from "../../../../src/notification";
import { MainPlayerStore } from "../../../../src/players";
import { BoostedOddsPromotionsHandlers } from "../../../../src/notification/boosted-odds/boosted-odds-handlers";

describe("Booted Odds tests", () => {
    describe("BoostedOddsPopupHandlers", () => {
        let boostedOddsPopupHandlers: BoostedOddsPromotionsHandlers.BoostedOddsPopupHandlers;
        let mockedBoostedOddsStore = stub<BoostedOddsStore>();
        const mockedMainPlayerStore = stub<MainPlayerStore>();
        const mockedAppStore = stub<AppStore>();

        beforeEach(() => {
            jest.clearAllMocks();
            boostedOddsPopupHandlers = new BoostedOddsPromotionsHandlers.BoostedOddsPopupHandlers(
                mockedBoostedOddsStore,
                mockedMainPlayerStore,
                mockedAppStore
            );
        });

        test("constructor should call resetBoostedOddsData", () => {
            // Assert
            expect(mockedBoostedOddsStore.resetBoostedOddsData).toHaveBeenCalledTimes(1);
        });

        describe("handle", () => {
            beforeEach(() => {
                mockedMainPlayerStore.offerGames = [{ gameId: 2 }, { gameId: 3 }, { gameId: 1 }];
                mockedBoostedOddsStore.boostedOddses = stub<BoostedOddsModel[]>([{ gameId: 1 }]);
                boostedOddsPopupHandlers.setTimeoutShowBoostedOdds = jest.fn(() => {});
            });

            it("should handle new promotions and update store", () => {
                // Arrange
                mockedAppStore.isDirectMode = false;

                const newPromotions = stub<BoostedOddsModel[]>([{ gameId: 1 }, { gameId: 2 }]);
                mockedBoostedOddsStore.promotions = stub<PromotionModel[]>([{ gameId: 1 }]);

                boostedOddsPopupHandlers.getPromotionsByOfferGames = jest.fn(() => newPromotions);
                boostedOddsPopupHandlers.checkIfReceiveNewPromotions = jest.fn(() => true);

                // Act
                boostedOddsPopupHandlers.handle(newPromotions);

                // Assert
                expect(mockedBoostedOddsStore.increaseBoostedOddCounter).toHaveBeenCalled();
                expect(boostedOddsPopupHandlers.setTimeoutShowBoostedOdds).toHaveBeenCalled();
                expect(mockedBoostedOddsStore.setIsAllowShowBoostedOddIcon).toHaveBeenCalledWith(false);
                expect(mockedBoostedOddsStore.setBoostedOddsModels).toHaveBeenCalledWith(newPromotions);
            });

            it("should not allow show boosted odds icon when new promotions are empty", () => {
                // Arrange
                const newPromotions = stub<BoostedOddsModel[]>([]);
                boostedOddsPopupHandlers.getPromotionsByOfferGames = jest.fn(() => newPromotions);

                // Act
                boostedOddsPopupHandlers.handle(newPromotions);

                // Assert
                expect(mockedBoostedOddsStore.setIsAllowShowBoostedOddIcon).not.toHaveBeenCalled();
                expect(mockedBoostedOddsStore.increaseBoostedOddCounter).not.toHaveBeenCalled();
                expect(boostedOddsPopupHandlers.setTimeoutShowBoostedOdds).not.toHaveBeenCalled();
                expect(mockedBoostedOddsStore.setBoostedOddsModels).not.toHaveBeenCalled();
            });

            it("should not allow show boosted odds icon when there is no new promotion and isAllowShowBoostedOddIcon is false", () => {
                // Arrange
                const newPromotions = stub<BoostedOddsModel[]>([{ gameId: 1 }, { gameId: 2 }]);

                mockedAppStore.isDirectMode = false;
                mockedBoostedOddsStore.isAllowShowBoostedOddIcon = false;
                mockedBoostedOddsStore.promotions = stub<PromotionModel[]>([{ gameId: 1 }]);

                boostedOddsPopupHandlers.getPromotionsByOfferGames = jest.fn(() => newPromotions);
                boostedOddsPopupHandlers.checkIfReceiveNewPromotions = jest.fn(() => false);

                // Act
                boostedOddsPopupHandlers.handle(newPromotions);

                // Assert
                expect(mockedBoostedOddsStore.increaseBoostedOddCounter).not.toHaveBeenCalled();
                expect(boostedOddsPopupHandlers.setTimeoutShowBoostedOdds).not.toHaveBeenCalled();
            });

            it("should not allow show boosted odds icon when promotions models are empty", () => {
                // Arrange
                const newPromotions = stub<BoostedOddsModel[]>([{ gameId: 1 }, { gameId: 2 }]);

                mockedAppStore.isDirectMode = false;
                mockedBoostedOddsStore.isAllowShowBoostedOddIcon = true;
                mockedBoostedOddsStore.promotions = stub<PromotionModel[]>([]);

                boostedOddsPopupHandlers.getPromotionsByOfferGames = jest.fn(() => newPromotions);
                boostedOddsPopupHandlers.checkIfReceiveNewPromotions = jest.fn(() => true);

                // Act
                boostedOddsPopupHandlers.handle(newPromotions);

                // Assert
                expect(mockedBoostedOddsStore.increaseBoostedOddCounter).not.toHaveBeenCalled();
                expect(boostedOddsPopupHandlers.setTimeoutShowBoostedOdds).toBeCalledTimes(1);
            });

            it("should not allow show boosted odds icon when it is direct mode", () => {
                // Arrange
                mockedAppStore.isDirectMode = true;

                const newPromotions = stub<BoostedOddsModel[]>([{ gameId: 1 }, { gameId: 2 }]);
                mockedBoostedOddsStore.promotions = stub<PromotionModel[]>([{ gameId: 1 }]);

                boostedOddsPopupHandlers.getPromotionsByOfferGames = jest.fn(() => newPromotions);
                boostedOddsPopupHandlers.checkIfReceiveNewPromotions = jest.fn(() => true);

                // Act
                boostedOddsPopupHandlers.handle(newPromotions);

                // Assert
                expect(mockedBoostedOddsStore.increaseBoostedOddCounter).not.toHaveBeenCalled();
                expect(boostedOddsPopupHandlers.setTimeoutShowBoostedOdds).not.toHaveBeenCalled();
            });
        });

        describe("checkIfReceiveNewPromotions", () => {
            const newPromotions = stub<BoostedOddsModel[]>([{ gameId: 3 }, { gameId: 2 }]);
            it("should return true if newPromotions length is greater than boostedOddses length", () => {
                // Arrange
                const boostedOddses = stub<BoostedOddsModel[]>([{ gameId: 2 }]);

                // Act
                const result = boostedOddsPopupHandlers.checkIfReceiveNewPromotions(newPromotions, boostedOddses);

                // Assert
                expect(result).toBe(true);
            });

            it("should return true if there are new promotions not present in boostedOddses", () => {
                // Arrange
                const boostedOddses = stub<BoostedOddsModel[]>([{ gameId: 1 }]);
                boostedOddsPopupHandlers.arePromotionsEqual = jest.fn(() => false);

                // Act
                const result = boostedOddsPopupHandlers.checkIfReceiveNewPromotions(newPromotions, boostedOddses);

                // Assert
                expect(result).toBe(true);
            });

            it("should return false if newPromotions length is not greater than boostedOddses length and there are no new promotions", () => {
                // Arrange
                const boostedOddses = stub<BoostedOddsModel[]>([{ gameId: 3 }, { gameId: 2 }]);
                boostedOddsPopupHandlers.arePromotionsEqual = jest.fn(() => true);

                // Act
                const result = boostedOddsPopupHandlers.checkIfReceiveNewPromotions(newPromotions, boostedOddses);

                // Assert
                expect(result).toBe(false);
            });
        });

        describe("arePromotionsEqual", () => {
            it("should return true for equal promotions", () => {
                // Arrange
                const promotion1 = stub<BoostedOddsModel>({
                    _id: "promotionId1",
                    startDateTime: "2023-08-31T10:00:00Z",
                    endDateTime: "2023-08-31T12:00:00Z",
                });

                const promotion2 = stub<BoostedOddsModel>({
                    _id: "promotionId1",
                    startDateTime: "2023-08-31T10:00:00Z",
                    endDateTime: "2023-08-31T12:00:00Z",
                });

                // Act
                const result = boostedOddsPopupHandlers.arePromotionsEqual(promotion1, promotion2);

                // Assert
                expect(result).toBe(true);
            });

            it("should return false for promotions with different _id", () => {
                // Arrange
                const promotion1 = stub<BoostedOddsModel>({
                    _id: "promotionId1",
                    startDateTime: "2023-08-31T10:00:00Z",
                    endDateTime: "2023-08-31T12:00:00Z",
                });

                const promotion2 = stub<BoostedOddsModel>({
                    _id: "promotionId2",
                    startDateTime: "2023-08-31T10:00:00Z",
                    endDateTime: "2023-08-31T12:00:00Z",
                });

                // Act
                const result = boostedOddsPopupHandlers.arePromotionsEqual(promotion1, promotion2);

                // Assert
                expect(result).toBe(false);
            });

            it("should return false for promotions with different startDateTime", () => {
                // Arrange
                const promotion1 = stub<BoostedOddsModel>({
                    _id: "promotionId1",
                    startDateTime: "2023-08-31T10:00:00Z",
                    endDateTime: "2023-08-31T12:00:00Z",
                });

                const promotion2 = stub<BoostedOddsModel>({
                    _id: "promotionId2",
                    startDateTime: "2023-09-31T10:00:00Z",
                    endDateTime: "2023-08-31T12:00:00Z",
                });

                // Act
                const result = boostedOddsPopupHandlers.arePromotionsEqual(promotion1, promotion2);

                // Assert
                expect(result).toBe(false);
            });
        });

        describe("getPromotionsByOfferGames", () => {
            // Arrange
            const mockData = stub<BoostedOddsModel[]>([{ gameId: 1 }, { gameId: 2 }, { gameId: 3 }]);

            it("should return promotions that match offerGames", () => {
                mockedMainPlayerStore.offerGames = [{ gameId: 1 }, { gameId: 2 }];

                // Act
                const result = boostedOddsPopupHandlers.getPromotionsByOfferGames(mockData);

                // Assert
                expect(result).toEqual([{ gameId: 1 }, { gameId: 2 }]);
            });

            it("should return an empty array if there are no matching offerGames", () => {
                // Arrange
                mockedMainPlayerStore.offerGames = [{ gameId: 4 }, { gameId: 5 }];

                // Act
                const result = boostedOddsPopupHandlers.getPromotionsByOfferGames(mockData);

                // Assert
                expect(result).toEqual([]);
            });

            it("should handle an empty data array", () => {
                // Act
                const result = boostedOddsPopupHandlers.getPromotionsByOfferGames([]);

                // Assert
                expect(result).toEqual([]);
            });
        });

        jest.useFakeTimers();
        describe("setTimeoutShowBoostedOdds", () => {
            let delayTime = 1000;

            beforeEach(() => {
                // Arrange
                boostedOddsPopupHandlers.delayTime = delayTime;
                boostedOddsPopupHandlers.clearTimeout = jest.fn();
            });

            afterEach(() => {
                jest.clearAllTimers();
            });

            it("should set isAllowShowBoostedOddIcon to true after the delay", () => {
                // Act
                boostedOddsPopupHandlers.setTimeoutShowBoostedOdds();
                jest.advanceTimersByTime(delayTime);

                // Assert
                expect(boostedOddsPopupHandlers.clearTimeout).toHaveBeenCalled();
                expect(mockedBoostedOddsStore.setIsAllowShowBoostedOddIcon).toHaveBeenCalledWith(true);
            });

            it("should not set isAllowShowBoostedOddIcon to true before the delay", () => {
                // Act
                boostedOddsPopupHandlers.setTimeoutShowBoostedOdds();

                // Assert
                expect(boostedOddsPopupHandlers.clearTimeout).toHaveBeenCalled();
                expect(mockedBoostedOddsStore.setIsAllowShowBoostedOddIcon).not.toHaveBeenCalled();
            });
        });

        describe("clearTimeout", () => {
            let clearTimeoutSpy: jest.SpyInstance<void, [timeoutId: string | number | NodeJS.Timeout | undefined], any>;

            beforeEach(() => {
                clearTimeoutSpy = jest.spyOn(global, "clearTimeout");
            });

            it("should clear the timeout if it exists", () => {
                // Arrange
                boostedOddsPopupHandlers.timeout = setTimeout(() => {}, 1000);

                // Act
                boostedOddsPopupHandlers.clearTimeout();

                // Assert
                expect(clearTimeoutSpy).toHaveBeenCalledWith(boostedOddsPopupHandlers.timeout);

                clearTimeoutSpy.mockRestore();
            });

            it("should do nothing if timeout does not exist", () => {
                // Act
                boostedOddsPopupHandlers.clearTimeout();

                // Assert
                expect(clearTimeoutSpy).not.toHaveBeenCalled();

                clearTimeoutSpy.mockRestore();
            });
        });
    });

    describe("PromotionHandlers", () => {
        let handlers: BoostedOddsPromotionsHandlers.PromotionHandlers;
        let mockedBoostedOddsStore: BoostedOddsStore;
        let mockedMainPlayerStore: MainPlayerStore;
        const mockPromotions: PromotionModel[] = stub<PromotionModel[]>([{ gameId: 1 }]);

        beforeEach(() => {
            jest.clearAllMocks();
            mockedBoostedOddsStore = stub<BoostedOddsStore>();
            mockedMainPlayerStore = stub<MainPlayerStore>();
        });

        it("handle method should set promotion models", () => {
            // Arrange
            mockedMainPlayerStore = stub<MainPlayerStore>({ offerGames: [{ gameId: 1 }] });
            handlers = new BoostedOddsPromotionsHandlers.PromotionHandlers(mockedBoostedOddsStore, mockedMainPlayerStore);

            // Act
            handlers.handle(mockPromotions);

            // Assert
            expect(mockedBoostedOddsStore.setPromotionModels).toHaveBeenCalledWith([mockPromotions[0]]);
        });

        it("handle method should not set promotion models if no matching games", () => {
            // Arrange
            mockedMainPlayerStore = stub<MainPlayerStore>({ offerGames: [{ gameId: 3 }] });
            handlers = new BoostedOddsPromotionsHandlers.PromotionHandlers(mockedBoostedOddsStore, mockedMainPlayerStore);

            // Act
            handlers.handle(mockPromotions);

            // Assert
            expect(mockedBoostedOddsStore.setPromotionModels).not.toHaveBeenCalled();
        });
    });
});
