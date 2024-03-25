import { injectable } from "inversify";
import * as _ from "lodash";
import { makeAutoObservable } from "mobx";
import { GameServiceMessage } from "../../../shared/models/game-messages";
import { OpenVerification } from "./definitions";

@injectable()
export class ProvablyFairStore {
    randomClientSeedEnabled = true;
    randomClientSeed = this.randomClientSeedValue();
    manualClientSeed = "";
    get clientSeed() {
        return this.randomClientSeedEnabled ? this.randomClientSeed : this.manualClientSeed;
    }

    openClientSeedPopup = {};

    openVerification: OpenVerification = null;

    pf: GameServiceMessage.ProvablyFair = null;

    constructor() {
        makeAutoObservable(this);
    }

    generateRandomClientSeed() {
        this.randomClientSeed = this.randomClientSeedValue();
    }

    resetClientSetting() {
        this.randomClientSeedEnabled = true;
        this.randomClientSeed = this.randomClientSeedValue();
        this.manualClientSeed = "";
    }

    private randomClientSeedValue(): string {
        return _.random(1000, 9999).toString();
    }

    get notAllowChangeClientSeed() {
        //TODO: service will send accepted client seed of the first bet,
        // should not allow change client seed after first bet
        return false;
    }

    get showManualClientSeedPopup() {
        return !this.randomClientSeedEnabled && this.manualClientSeed === "";
    }

    get highlightManualMode() {
        return !this.notAllowChangeClientSeed && !this.randomClientSeedEnabled;
    }

    get highlightRandomMode() {
        return !this.notAllowChangeClientSeed && this.randomClientSeedEnabled;
    }
}
