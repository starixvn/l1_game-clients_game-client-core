import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";

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
    showBoostedOddIcon = true;
    popupCounter = 0;
    boostedOddsCounter = 0;

    constructor() {
        makeAutoObservable(this);
    }

    setData(promotions: Array<PromotionModel>) {
        this.promotions = promotions;
    }

    increasePopupCounter() {
        this.popupCounter++;
    }

    setShowBoostedOddIcon(showBoostedOddIcon: boolean) {
        this.showBoostedOddIcon = showBoostedOddIcon;
    }

    increaseBoostedOddCounter() {
        this.boostedOddsCounter++;
    }
}
