import { inject, injectable } from "inversify";
import { IHandler, NotificationServiceMessage } from "../../shared";
import { BoostedOddsModel, BoostedOddsStore, PromotionModel } from "./boosted-odds-store";
import { MainPlayerStore } from "../../players/main-player-store";
import { AppStore } from "../../app";

export namespace BoostedOddsPromotionsHandlers {
    @injectable()
    export class BoostedOddsPopupHandlers implements IHandler<Array<BoostedOddsModel>> {
        name = NotificationServiceMessage.BoostedOdd.eventName;

        timeout: NodeJS.Timeout;
        minutesToMillisecond = 60 * 1000;
        delayTime = 15 * this.minutesToMillisecond;

        constructor(
            @inject(BoostedOddsStore) private readonly boostedOddsStore: BoostedOddsStore,
            @inject(MainPlayerStore) private readonly mainPlayerStore: MainPlayerStore,
            @inject(AppStore) private readonly appStore: AppStore
        ) {}

        handle(data: Array<BoostedOddsModel>) {
            const newPromotions = this.getPromotionsByOfferGames(data);
            this.boostedOddsStore.setIsAllowShowBoostedOddIcon(true);

            if (newPromotions?.length > 0) {
                const { boostedOddses, promotions, isAllowShowBoostedOddIcon } = this.boostedOddsStore;
                if (
                    (this.checkIfReceiveNewPromotions(newPromotions, boostedOddses) || isAllowShowBoostedOddIcon) &&
                    promotions?.length > 0 &&
                    !this.appStore.isDirectMode
                ) {
                    this.boostedOddsStore.increaseBoostedOddCounter();
                    this.setTimeoutShowBoostedOdds();
                }

                this.boostedOddsStore.setIsAllowShowBoostedOddIcon(false);
                this.boostedOddsStore.setBoostedOddsModels(newPromotions);
            }
        }

        checkIfReceiveNewPromotions(newPromotions: Array<BoostedOddsModel>, boostedOddses: Array<BoostedOddsModel>) {
            if (newPromotions?.length > boostedOddses?.length) {
                return true;
            }

            return (
                newPromotions.filter(
                    (newPromotion) => !boostedOddses.some((currentPromotion) => this.arePromotionsEqual(newPromotion, currentPromotion))
                ).length > 0
            );
        }

        arePromotionsEqual(promotion1: BoostedOddsModel, promotion2: BoostedOddsModel): boolean {
            const startTimeEqual = new Date(promotion1.startDateTime).getTime() === new Date(promotion2.startDateTime).getTime();
            const endTimeEqual = new Date(promotion1.endDateTime).getTime() === new Date(promotion2.endDateTime).getTime();
            return promotion1._id === promotion2._id && startTimeEqual && endTimeEqual;
        }

        getPromotionsByOfferGames(data: Array<BoostedOddsModel>) {
            return data.filter((promotion) => this.mainPlayerStore.offerGames?.some((game) => game.gameId === promotion.gameId));
        }

        setTimeoutShowBoostedOdds(): void {
            this.clearTimeout();
            this.timeout = setTimeout(() => {
                this.boostedOddsStore.setIsAllowShowBoostedOddIcon(true);
            }, this.delayTime);
        }

        clearTimeout() {
            this.timeout && clearTimeout(this.timeout);
        }
    }

    @injectable()
    export class PromotionHandlers implements IHandler<Array<PromotionModel>> {
        name = NotificationServiceMessage.PromotionNotifications.eventName;
        constructor(
            @inject(BoostedOddsStore) private readonly boostedOddsStore: BoostedOddsStore,
            @inject(MainPlayerStore) private readonly mainPlayerStore: MainPlayerStore
        ) {}

        handle(data: Array<PromotionModel>) {
            const newPromotions = data.filter((promotion) =>
                this.mainPlayerStore.offerGames?.some((game) => game.gameId === promotion.gameId)
            );
            newPromotions.length > 0 && this.boostedOddsStore.setPromotionModels(newPromotions);
        }
    }
}
