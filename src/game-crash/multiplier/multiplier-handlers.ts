import { inject, injectable } from "inversify";

import { reaction } from "mobx";
import { RoundTimeStore } from "../../game/rounds/round-time-store";
import { IHandler } from "../../shared";
import { GameCrashServiceMessage, RocketState } from "../game-crash-messages";
import { MultiplierStore } from "./multiplier-store";

@injectable()
export class MultiplierHandlers implements IHandler<GameCrashServiceMessage.CrashMultiplierInfo> {
    name = GameCrashServiceMessage.CrashMultiplierInfo.eventName;

    constructor(
        @inject(MultiplierStore) protected readonly multiplierStore: MultiplierStore,
        @inject(RoundTimeStore) private readonly roundTimeStore: RoundTimeStore
    ) {
        reaction(
            () => this.roundTimeStore.roundTime,
            (roundTime) => {
                if (roundTime > this.roundTimeStore.placingBet + this.roundTimeStore.startRound) {
                    this.handleRocketState(RocketState.CRASHED);
                } else if (roundTime <= 0) {
                    this.handleRocketState(RocketState.FLYING);
                } else {
                    this.handleRocketState(RocketState.ONLAND);
                }
            }
        );
    }

    handle(multiplierInfo: GameCrashServiceMessage.CrashMultiplierInfo) {
        this.multiplierStore.multiplier = multiplierInfo.m;
        this.multiplierStore.time = multiplierInfo.t;
    }

    handleMultiplierCrashed(multiplier: number) {
        this.multiplierStore.multiplier = multiplier;
    }

    handleRocketState(rocketState: string) {
        this.multiplierStore.rocketState = rocketState;
    }
}
