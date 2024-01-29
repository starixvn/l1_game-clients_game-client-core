import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";

export interface CrashSingleClientSeed {
    name: string;
    seed: string;
}
export interface CrashClientSeed {
    players: CrashSingleClientSeed[];
    mergedSeed: string;
}

export interface CrashPFVerfication {
    roundId: number;
    serverHash: string;
    crashPoint?: number;
    serverSeed?: string;
    clientSeed?: CrashClientSeed;
    combinedHash?: string;
}

@injectable()
export class ProvablyFairStore {
    randomClientSeedEnabled = true;
    manualClientSeed = "";
    randomClientSeed = "";

    get clientSeed() {
        return this.randomClientSeedEnabled ? this.randomClientSeed : this.manualClientSeed;
    }

    openClientSeedPopup = false;

    verification: CrashPFVerfication = null;

    constructor() {
        makeAutoObservable(this);
    }
}
