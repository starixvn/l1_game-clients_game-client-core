import { stub } from "jest-auto-stub";
import { AutoCashOutPopupStore } from "../../../../src/game-crash/auto-cash-out/auto-cash-out-popup-store";
import { AutoPlayStore } from "../../../../src/game-crash/auto-play/auto-play-store";
import { BetInputStore } from "../../../../src/game-crash/bet-input/bet-input-store";
import { Md5PopupStore } from "../../../../src/game-crash/md5-popup/md5-popup-store";
import { PopupsGameStore } from "../../../../src/game-crash/popups/popups-game-store";
import { PopupsHandlers } from "../../../../src/game-crash/popups/popups-handlers";

describe("PopupsHandlers", () => {
    let popupsHandlers: PopupsHandlers;
    let md5PopupStore: Md5PopupStore;
    let autoPlayStore: AutoPlayStore;
    let betInputStore: BetInputStore;
    let autoCashOutStore: AutoCashOutPopupStore;
    let overlayPopupStore: PopupsGameStore;

    beforeAll(() => {
        md5PopupStore = stub<Md5PopupStore>();
        autoPlayStore = stub<AutoPlayStore>();
        betInputStore = stub<BetInputStore>();
        autoCashOutStore = stub<AutoCashOutPopupStore>();
        overlayPopupStore = stub<PopupsGameStore>();
    });

    beforeEach(() => {
        jest.clearAllMocks();
        popupsHandlers = new PopupsHandlers(md5PopupStore, autoPlayStore, betInputStore, autoCashOutStore, overlayPopupStore);
    });

    describe("closeOtherPopupsWithoutMd5", () => {
        it("should close other popups without md5", () => {
            //Arrange

            //Act
            popupsHandlers.closeOtherPopupsWithoutMd5();

            //Assert
            expect(autoPlayStore.isOpenAutoPlayPopup).toEqual(false);
            expect(betInputStore.isOpenBetAmountPopup).toEqual(false);
            expect(autoCashOutStore.enable).toEqual(false);
            expect(overlayPopupStore.enabledOverlay).toEqual(true);
        });
    });

    describe("closeOtherPopupsWithoutAutoPlay", () => {
        it("should close other popups without auto play", () => {
            //Arrange

            //Act
            popupsHandlers.closeOtherPopupsWithoutAutoPlay();

            //Assert
            expect(md5PopupStore.isOpenPopupMd5).toEqual(false);
            expect(betInputStore.isOpenBetAmountPopup).toEqual(false);
            expect(autoCashOutStore.enable).toEqual(false);
            expect(overlayPopupStore.enabledOverlay).toEqual(true);
        });
    });

    describe("closeOtherPopupsWithoutBetInput", () => {
        it("should close other popups without bet input", () => {
            //Arrange

            //Act
            popupsHandlers.closeOtherPopupsWithoutBetInput();

            //Assert
            expect(md5PopupStore.isOpenPopupMd5).toEqual(false);
            expect(autoPlayStore.isOpenAutoPlayPopup).toEqual(false);
            expect(autoCashOutStore.enable).toEqual(false);
            expect(overlayPopupStore.enabledOverlay).toEqual(true);
        });
    });

    describe("closeOtherPopupsWithoutAutoCashOut", () => {
        it("should close other popups without auto cash out", () => {
            //Arrange

            //Act
            popupsHandlers.closeOtherPopupsWithoutAutoCashOut();

            //Assert
            expect(md5PopupStore.isOpenPopupMd5).toEqual(false);
            expect(betInputStore.isOpenBetAmountPopup).toEqual(false);
            expect(autoPlayStore.isOpenAutoPlayPopup).toEqual(false);
            expect(overlayPopupStore.enabledOverlay).toEqual(true);
        });
    });

    describe("closeAllPopups", () => {
        it("should close all popups ", () => {
            //Arrange

            //Act
            popupsHandlers.closeAllPopups();

            //Assert
            expect(md5PopupStore.isOpenPopupMd5).toEqual(false);
            expect(autoPlayStore.isOpenAutoPlayPopup).toEqual(false);
            expect(betInputStore.isOpenBetAmountPopup).toEqual(false);
            expect(autoCashOutStore.enable).toEqual(false);
            expect(overlayPopupStore.enabledOverlay).toEqual(false);
        });
    });
});
