import { inject, injectable } from "inversify";
import { IHandler, NotificationServiceMessage } from "../../shared";
import { BoostedOddsModel, BoostedOddsStore, PromotionModel } from "./boosted-odds-store";
import { MainPlayerStore } from "../../players/main-player-store";
import { AppStore } from "../../app";

export namespace BoostedOddsPromotionsHandlers {
    @injectable()
    export class BoostedOddsPopupHandlers implements IHandler<Array<BoostedOddsModel>> {
        name = NotificationServiceMessage.BoostedOdd.eventName;

        timeout: any;
        minutesToMillisecond = 60 * 1000;
        delayTime = 15 * this.minutesToMillisecond;

        constructor(
            @inject(BoostedOddsStore) private readonly boostedOddsStore: BoostedOddsStore,
            @inject(MainPlayerStore) private readonly mainPlayerStore: MainPlayerStore,
            @inject(AppStore) private readonly appStore: AppStore
        ) {}

        handle(data: Array<BoostedOddsModel>) {
            const newPromotions = data.filter((promotion) =>
                this.mainPlayerStore.offerGames?.some((game) => game.gameId === promotion.gameId)
            );

            const { boostedOddses, promotions, isAllowShowBoostedOddIcon } = this.boostedOddsStore;

            if (newPromotions.length > 0) {
                let haveNewPromotion = newPromotions?.length > boostedOddses?.length;
                if (!haveNewPromotion) {
                    const filterNewPromotion = newPromotions.filter(
                        (newPromotion) =>
                            !boostedOddses.some(
                                (currentPromotion) =>
                                    newPromotion._id === currentPromotion._id &&
                                    new Date(newPromotion.startDateTime).getTime() === new Date(currentPromotion.startDateTime).getTime() &&
                                    new Date(newPromotion.endDateTime).getTime() === new Date(currentPromotion.endDateTime).getTime()
                            )
                    );
                    haveNewPromotion = filterNewPromotion.length > 0;
                }

                if ((haveNewPromotion || isAllowShowBoostedOddIcon) && promotions?.length > 0 && !this.appStore.isDirectMode) {
                    this.boostedOddsStore.increaseBoostedOddCounter();
                    this.setTimeoutShowBoostedOdds();
                }

                this.boostedOddsStore.setIsAllowShowBoostedOddIcon(false);
                this.boostedOddsStore.setBoostedOddsModels(newPromotions);
            }
        }

        setTimeoutShowBoostedOdds(): void {
            this.timeout && clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this.boostedOddsStore.setIsAllowShowBoostedOddIcon(true);
            }, this.delayTime);
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
            this.boostedOddsStore.setPromotionModels(newPromotions);
        }
    }
}
