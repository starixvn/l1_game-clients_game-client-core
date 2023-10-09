import { injectable, inject } from "inversify";
import { makeObservable, observable } from "mobx";
import { AuthStore } from "../../auth";
import { AppTypes } from "../../shared/constants/app-type";

export class BaseBoostedOddsModel {
    gameId: number;
}
export class PromotionModel extends BaseBoostedOddsModel {
    _id: string;
    time: string;
    message: string;
    messages: object;
    title: object;
    startTime: string;
    endTime: string;
    promotionId: string;
    enabled: boolean;
    isActive: boolean;
    displayKind: number;
    gameName: string;
}

export class BoostedOddsModel extends BaseBoostedOddsModel {
    _id: string;
    endDateTime: string;
    isDaily: boolean;
    odds: any;
    startDateTime: string;
    status: string;
    time: string;
}

@injectable()
export class BoostedOddsStore {
    promotions: Array<PromotionModel> = [];
    popupCounter = 0;
    boostedOddsCounter = 0;
    isLoadingIcon = false;
    boostedOddsIconShowedTimeInMiliseconds = 10;

    boostedOddses: Array<BoostedOddsModel> = [];
    isAllowShowBoostedOddIcon = true;

    constructor(@inject(AuthStore) private readonly authStore: AuthStore) {
        if (this.authStore.system === AppTypes.Instant) {
            this.boostedOddsIconShowedTimeInMiliseconds = 15;
        }

        makeObservable(this, {
            isLoadingIcon: observable,
            promotions: observable,
            popupCounter: observable,
            boostedOddsCounter: observable,
        });
    }

    setPromotionModels(promotions: Array<PromotionModel>) {
        this.promotions = promotions;
    }

    setBoostedOddsModels(boostedOddses: Array<BoostedOddsModel>) {
        this.boostedOddses = boostedOddses;
    }

    increasePopupCounter() {
        this.popupCounter++;
    }

    increaseBoostedOddCounter() {
        this.boostedOddsCounter++;
    }

    setIsLoadingIcon(isLoadingIcon: boolean) {
        this.isLoadingIcon = isLoadingIcon;
    }

    setIsAllowShowBoostedOddIcon(isAllowShowBoostedOddIcon: boolean) {
        this.isAllowShowBoostedOddIcon = isAllowShowBoostedOddIcon;
    }

    resetBoostedOddsData() {
        this.boostedOddses = [];
        this.isAllowShowBoostedOddIcon = true;
    }
}
