import { inject, injectable } from "inversify";

import { IHandler } from "../../shared";
import { GameCrashServiceMessage } from "../game-crash-messages";
import { MultiplierStore } from "./multiplier-store";

@injectable()
export class MultiplierHandlers implements IHandler<GameCrashServiceMessage.CrashMultiplierInfo> {
    name = GameCrashServiceMessage.CrashMultiplierInfo.eventName;

    constructor(@inject(MultiplierStore) protected readonly multiplierStore: MultiplierStore) {}

    handle(multiplierInfo: GameCrashServiceMessage.CrashMultiplierInfo) {
        this.multiplierStore.multiplier = multiplierInfo.m;
        this.multiplierStore.time = multiplierInfo.t;
    }

    handleMultiplierCrashed(multiplier: number) {
        this.multiplierStore.multiplier = multiplier;
    }

    handleIsCrashed(isCrashed: boolean) {
        this.multiplierStore.isCrashed = isCrashed;
    }
}
