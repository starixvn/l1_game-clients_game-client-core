import { inject, injectable } from "inversify";
import { IHandler } from "../../shared";
import { RoundStore } from "./round-store";

export namespace RoundUIHandlers {
    @injectable()
    export class SetRoundId implements IHandler<number> {
        constructor(@inject(RoundStore) private readonly store: RoundStore) {}
        handle(roundId: number): void {
            this.store.roundId = roundId;
        }
    }

    @injectable()
    export class ResetRoundStore implements IHandler<void> {
        constructor(@inject(RoundStore) private readonly store: RoundStore) {}
        handle() {
            this.store.resetForNewRound();
        }
    }
}
