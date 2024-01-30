import { injectable } from "inversify";
import * as _ from "lodash";
import { makeAutoObservable } from "mobx";

export interface CrashSingleClientSeed {
    nickname: string;
    clientSeed: string;
}

export interface CrashPFVerfication {
    roundId: number;
    serverSeedHash: string;
    crashPoint?: number;
    serverSeed?: string;
    clientSeeds?: CrashSingleClientSeed[];
    mergeSeed?: string;
    finalHash?: string;
}

@injectable()
export class ProvablyFairStore {
    randomClientSeedEnabled = true;
    manualClientSeed = "";
    randomClientSeed = _.random(1000, 9999).toString();

    get clientSeed() {
        return this.randomClientSeedEnabled ? this.randomClientSeed : this.manualClientSeed;
    }

    openClientSeedPopup = false;

    verification: CrashPFVerfication = null;

    constructor() {
        makeAutoObservable(this);
    }
}
