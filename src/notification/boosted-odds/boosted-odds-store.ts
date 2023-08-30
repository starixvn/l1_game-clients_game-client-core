import { injectable } from "inversify";
import { makeObservable, observable } from "mobx";

export class PromotionModel {
    _id: string;
    time: string;
    message: string;
    gameName: string;
    messages: object;
    title: object;
    startTime: string;
    endTime: string;
    promotionId: string;
    enabled: boolean;
    gameId: number;
    isActive: boolean;
    displayKind: number;
}

export class BoostedOddsModel {
    gameId: number;
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

    boostedOddses: Array<BoostedOddsModel> = [];
    isAllowShowBoostedOddIcon = false;

    constructor() {
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
}
