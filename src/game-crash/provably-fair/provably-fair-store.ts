import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";

@injectable()
export class ProvablyFairStore {
    randomClientSeedEnabled = true;
    manualClientSeed = "";
    randomClientSeed = "";

    get clientSeed() {
        return this.randomClientSeedEnabled ? this.randomClientSeed : this.manualClientSeed;
    }

    openClientSeedPopup = false;

    constructor() {
        makeAutoObservable(this);
    }
}
