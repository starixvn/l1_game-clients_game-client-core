import { inject, injectable } from "inversify";
import { IHandler } from "../../shared";
import { RoundStore } from "./round-store";
import { RoundTimeStore } from "./round-time-store";

export namespace RoundUIHandlers {
    @injectable()
    export class SetRoundId implements IHandler<number> {
        constructor(@inject(RoundStore) private readonly store: RoundStore) {}
        handle(roundId: number): void {
            this.store.roundId = roundId;
        }
    }

    @injectable()
    export class GetCurrentRoundState implements IHandler<void> {
        constructor(@inject(RoundTimeStore) private readonly store: RoundTimeStore) {}
        handle() {
            this.store.setJoinGameState();
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
