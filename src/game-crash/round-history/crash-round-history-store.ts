import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";

import { RoundHistory, RoundHistoryStore } from "../../game/round-histories/round-history-store";
import { RoundStore } from "../../game/rounds/round-store";
import { RoundTimeStore } from "../../game/rounds/round-time-store";
import { SettlementStore } from "../../game/settlements/settlement-store";
import { Md5PopupStore } from "../md5-popup/md5-popup-store";
import { ProvablyFairStore } from "../provably-fair/provably-fair-store";

@injectable()
export class CrashRoundHistoryStore {
    constructor(
        @inject(RoundTimeStore) protected readonly roundTimeStore: RoundTimeStore,
        @inject(RoundHistoryStore) protected readonly roundHistoryStore: RoundHistoryStore,
        @inject(RoundStore) protected readonly roundStore: RoundStore,
        @inject(SettlementStore) protected readonly settlementStore: SettlementStore,
        @inject(Md5PopupStore) protected readonly md5PopupStore: Md5PopupStore,
        @inject(ProvablyFairStore) protected readonly pfStore: ProvablyFairStore
    ) {
        makeAutoObservable(this);
    }

    private readonly _lastRound: RoundHistory = { roundId: 0, result: {}, md5Result: {}, settlementResult: {} };
    get currentRound(): RoundHistory {
        return {
            roundId: this.pfStore.pf.roundId,
            pf: this.pfStore.pf,
            result: null,
            settlementResult: null,
        };
    }

    get roundHistories() {
        let roundHistory: RoundHistory[] = [];

        const lastRoundId = this.roundHistoryStore.histories[0]?.roundId;
        if (!this.pfStore.pf || lastRoundId === this.pfStore.pf.roundId || this.roundTimeStore.isStartRound) {
            roundHistory = this.roundHistoryStore.histories;
        } else {
            roundHistory = [this.currentRound, ...this.roundHistoryStore.histories];
        }

        return roundHistory;
    }

    get md5PopupData() {
        return this.roundHistories.find((obj) => obj.roundId === this.md5PopupStore.roundId);
    }

    get roundIndex(): number {
        return this.roundHistories.findIndex((obj) => obj.roundId === this.md5PopupStore.roundId);
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
        return this.roundIndex > 0 || this.roundIndex === -1;
    }

    get decreaseStatus(): boolean {
        if (this.roundIndex === -1) {
            return false;
        }
        return this.roundIndex < this.roundHistoryStore.histories.length - 1;
    }
}
