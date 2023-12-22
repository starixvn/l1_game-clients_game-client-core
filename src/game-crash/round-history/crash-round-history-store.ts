import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";

import { RoundHistory, RoundHistoryStore } from "../../game/round-histories/round-history-store";
import { RoundStore } from "../../game/rounds/round-store";
import { RoundTimeStore } from "../../game/rounds/round-time-store";
import { SettlementStore } from "../../game/settlements/settlement-store";
import { Md5PopupStore } from "../md5-popup/md5-popup-store";

@injectable()
export class CrashRoundHistoryStore {
    constructor(
        @inject(RoundTimeStore) protected readonly roundTimeStore: RoundTimeStore,
        @inject(RoundHistoryStore) protected readonly roundHistoryStore: RoundHistoryStore,
        @inject(RoundStore) protected readonly roundStore: RoundStore,
        @inject(SettlementStore) protected readonly settlementStore: SettlementStore,
        @inject(Md5PopupStore) protected readonly md5PopupStore: Md5PopupStore
    ) {
        makeAutoObservable(this);
    }

    private readonly _lastRound: RoundHistory = { roundId: 0, result: {}, md5Result: {}, settlementResult: {} };
    private _roundIndex = 0;
    get roundHistories() {
        let roundHistoy: RoundHistory[] = [];

        const lastRoundId = this.roundHistoryStore.histories[0]?.roundId;
        if (lastRoundId === this.lastRound.roundId || this.roundTimeStore.isStartRound) {
            roundHistoy = this.roundHistoryStore.histories;
        } else {
            roundHistoy = [this.lastRound, ...this.roundHistoryStore.histories];
        }

        return roundHistoy;
    }

    get md5PopupData() {
        const roundItem = this.roundHistories.find((obj) => {
            return obj.roundId === this.md5PopupStore.roundId;
        });
        this._roundIndex = this.roundHistories.findIndex((obj) => obj.roundId === this.md5PopupStore.roundId);
        return roundItem;
    }

    get lastRound(): RoundHistory {
        const resultHash = this.roundStore.resultHash;
        if (resultHash) {
            if (resultHash.hashValue && this._lastRound.md5Result) {
                this._lastRound.md5Result["hashValue"] = resultHash.hashValue;
                delete this._lastRound.md5Result["rawValue"];
            }
            if (resultHash.rawValue && this._lastRound.md5Result) {
                this._lastRound.md5Result["rawValue"] = resultHash.rawValue;
            }
        }
        this._lastRound.roundId = this.roundStore.clientRoundId;
        this.settlementStore.currentFinish?.result && (this._lastRound.result = this.settlementStore.currentFinish.result);

        return {
            md5Result: this._lastRound.md5Result,
            result: this._lastRound.result,
            roundId: this._lastRound.roundId,
            settlementResult: this._lastRound.settlementResult,
        };
    }
    get increaseStatus(): boolean {
        return this._roundIndex > 0 || this._roundIndex === -1;
    }

    get descreaseStatus(): boolean {
        if (this._roundIndex === -1) {
            return false;
        }
        return this._roundIndex < this.roundHistoryStore.histories.length - 1;
    }
}
