import gc from "game-client-base";
import inversify from "inversify";
import { SlidingChipStore } from "../stores/sliding-chip-store";

const { injectable, inject } = inversify;
export namespace SlidingChipHandler {
    @injectable()
    export class OnLoad implements gc.Shared.IHandler<void> {
        @inject(SlidingChipStore) private readonly slidingChipStore: SlidingChipStore;

        async handle() {
            this.slidingChipStore.selectChip = 0;
        }
    }

    @injectable()
    export class ClickArrow {
        @inject(SlidingChipStore) private readonly slidingChipStore: SlidingChipStore;

        async handleNext({ chipMovingStep }) {
            this.slidingChipStore.handleClickNext(chipMovingStep);
        }

        async handlePrev({ chipMovingStep }) {
            this.slidingChipStore.handleClickPrev(chipMovingStep);
        }
    }

    @injectable()
    export class CreateChips implements gc.Shared.IHandler<{ chipsLength: number }> {
        @inject(SlidingChipStore) private readonly slidingChipStore: SlidingChipStore;

        async handle({ chipsLength }) {
            this.slidingChipStore.chipsLength = chipsLength;
        }
    }

    @injectable()
    export class UpdateChips implements gc.Shared.IHandler<void> {
        @inject(SlidingChipStore) private readonly slidingChipStore: SlidingChipStore;

        async handle() {
            const chipValues = this.slidingChipStore.chipValues;
            const currentBet =
                chipValues.findIndex((value) => parseInt(value.toString()) === parseInt(this.slidingChipStore.currentBet)) !== -1
                    ? this.slidingChipStore.currentBet
                    : chipValues[0] && chipValues[0].toString();
            if (currentBet === undefined) {
                return;
            }
            this.slidingChipStore.isResetScrollViewOffset = currentBet !== this.slidingChipStore.currentBet;
            this.slidingChipStore.currentBet = currentBet;
        }
    }

    @injectable()
    export class UpdateChipsValue implements gc.Shared.IHandler<void> {
        @inject(SlidingChipStore) private readonly slidingChipStore: SlidingChipStore;

        async handle() {
            this.slidingChipStore.setChipsByStakeLevel();
        }
    }

    @injectable()
    export class UpdateSelectChip implements gc.Shared.IHandler<{ displayMin: number; displaySize: number }> {
        @inject(SlidingChipStore) private readonly slidingChipStore: SlidingChipStore;

        async handle({ displayMin, displaySize }) {
            this.slidingChipStore.handleSelectChip(displayMin, displaySize);
        }
    }

    @injectable()
    export class SetSelectChipAndScroll implements gc.Shared.IHandler<{ selectedChip: number }> {
        @inject(SlidingChipStore) private readonly slidingChipStore: SlidingChipStore;

        async handle({ selectedChip }) {
            this.slidingChipStore.selectChip = selectedChip;
        }
    }

    @injectable()
    export class UpdateCurrentBet implements gc.Shared.IHandler<{ bet: string }> {
        @inject(SlidingChipStore) private readonly slidingChipStore: SlidingChipStore;

        async handle({ bet }) {
            this.slidingChipStore.currentBet = bet;
        }
    }

    @injectable()
    export class HandleFlyChip implements gc.Shared.IHandler<{ betItem: Node; amount: number }> {
        @inject(SlidingChipStore) private readonly slidingChipStore: SlidingChipStore;

        async handle({ betItem, amount }) {
            this.slidingChipStore.betItem = { node: betItem, bet: amount };
        }
    }
}
