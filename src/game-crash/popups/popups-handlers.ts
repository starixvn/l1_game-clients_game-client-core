import { inject, injectable } from "inversify";

import { AutoCashOutPopupStore } from "../auto-cash-out/auto-cash-out-popup-store";
import { AutoPlayStore } from "../auto-play/auto-play-store";
import { BetInputStore } from "../bet-input/bet-input-store";
import { Md5PopupStore } from "../md5-popup/md5-popup-store";
import { PopupsGameStore } from "./popups-game-store";

@injectable()
export class PopupsHandlers {
    constructor(
        @inject(Md5PopupStore) private readonly md5PopupStore: Md5PopupStore,
        @inject(AutoPlayStore) private readonly autoPlayStore: AutoPlayStore,
        @inject(BetInputStore) private readonly betInputStore: BetInputStore,
        @inject(AutoCashOutPopupStore) private readonly autoCashOutStore: AutoCashOutPopupStore,
        @inject(PopupsGameStore) private readonly overlayPopupStore: PopupsGameStore
    ) {}

    closeOtherPopupsWithoutMd5() {
        this.autoPlayStore.isOpenAutoPlayPopup = false;
        this.betInputStore.isOpenBetAmountPopup = false;
        this.autoCashOutStore.enable = false;
        this.overlayPopupStore.enabledOverlay = true;
    }

    closeOtherPopupsWithoutAutoPlay() {
        this.md5PopupStore.isOpenPopupMd5 = false;
        this.betInputStore.isOpenBetAmountPopup = false;
        this.autoCashOutStore.enable = false;
        this.overlayPopupStore.enabledOverlay = true;
    }

    closeOtherPopupsWithoutBetInput() {
        this.md5PopupStore.isOpenPopupMd5 = false;
        this.autoPlayStore.isOpenAutoPlayPopup = false;
        this.autoCashOutStore.enable = false;
        this.overlayPopupStore.enabledOverlay = true;
    }

    closeOtherPopupsWithoutAutoCashOut() {
        this.md5PopupStore.isOpenPopupMd5 = false;
        this.betInputStore.isOpenBetAmountPopup = false;
        this.autoPlayStore.isOpenAutoPlayPopup = false;
        this.overlayPopupStore.enabledOverlay = true;
    }

    closeAllPopups() {
        this.md5PopupStore.isOpenPopupMd5 = false;
        this.autoPlayStore.isOpenAutoPlayPopup = false;
        this.betInputStore.isOpenBetAmountPopup = false;
        this.autoCashOutStore.enable = false;
        this.overlayPopupStore.enabledOverlay = false;
    }
}
