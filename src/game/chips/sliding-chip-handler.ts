import { inject, injectable } from "inversify";
import { IHandler } from "../../shared";
import { SlidingChipStore } from "./sliding-chip-store";

export namespace SlidingChipHandler {
    @injectable()
    export class OnLoad implements IHandler<void> {
        constructor(@inject(SlidingChipStore) private readonly slidingChipStore: SlidingChipStore) {}

        async handle() {
            this.slidingChipStore.selectChip = 0;
        }
    }

    @injectable()
    export class ClickNext implements IHandler<{ chipMovingStep: number }> {
        constructor(@inject(SlidingChipStore) private readonly slidingChipStore: SlidingChipStore) {}

        async handle({ chipMovingStep }) {
            this.slidingChipStore.handleClickNext(chipMovingStep);
        }
    }

    @injectable()
    export class ClickPrev implements IHandler<{ chipMovingStep: number }> {
        constructor(@inject(SlidingChipStore) private readonly slidingChipStore: SlidingChipStore) {}

        async handle({ chipMovingStep }) {
            this.slidingChipStore.handleClickPrev(chipMovingStep);
        }
    }

    @injectable()
    export class CreateChips implements IHandler<{ chipsLength: number }> {
        constructor(@inject(SlidingChipStore) private readonly slidingChipStore: SlidingChipStore) {}

        async handle({ chipsLength }) {
            this.slidingChipStore.chipsLength = chipsLength;
        }
    }

    @injectable()
    export class UpdateChips implements IHandler<void> {
        constructor(@inject(SlidingChipStore) private readonly slidingChipStore: SlidingChipStore) {}

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
    export class UpdateChipsValue implements IHandler<void> {
        constructor(@inject(SlidingChipStore) private readonly slidingChipStore: SlidingChipStore) {}

        async handle() {
            this.slidingChipStore.setChipsByStakeLevel();
        }
    }

    @injectable()
    export class UpdateSelectChip implements IHandler<{ displayMin: number; displaySize: number }> {
        constructor(@inject(SlidingChipStore) private readonly slidingChipStore: SlidingChipStore) {}

        async handle({ displayMin, displaySize }) {
            this.slidingChipStore.handleSelectChip(displayMin, displaySize);
        }
    }

    @injectable()
    export class SetSelectChipAndScroll implements IHandler<{ selectedChip: number }> {
        constructor(@inject(SlidingChipStore) private readonly slidingChipStore: SlidingChipStore) {}

        async handle({ selectedChip }) {
            this.slidingChipStore.selectChip = selectedChip;
        }
    }

    @injectable()
    export class UpdateCurrentBet implements IHandler<{ bet: string }> {
        constructor(@inject(SlidingChipStore) private readonly slidingChipStore: SlidingChipStore) {}

        async handle({ bet }) {
            this.slidingChipStore.currentBet = bet;
        }
    }
}
