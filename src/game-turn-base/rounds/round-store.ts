import { inject, injectable } from "inversify";

import { MainPlayerStore } from "../../players";
import { GameServiceMessage } from "../../shared";
import { GameConfigStore } from "../../game/game-configs";
import { RoundHistoryStore } from "../../game/round-histories";
import { SettlementStore } from "../../game/settlements";
import { TURN_ROUND_STATE, RoundTimeStore } from "./round-time-store";
import { Turn } from "./round-handlers";
import { RoundOdds, RoundStore as RoundStoreBase } from "../../game/rounds";
import { action, makeObservable, observable } from "mobx";

@injectable()
export class RoundStore extends RoundStoreBase {
    drawId = 0;
    turnCounter = 1;
    turnObject: Turn = null;
    odds: GameServiceMessage.Odds = {};
    roundData: GameServiceMessage.TurnBaseGameRoundData = {
        balls: [],
        drawId: 0
    };

    constructor(
        @inject(GameConfigStore) protected readonly gameConfigStore: GameConfigStore,
        @inject(RoundHistoryStore) protected readonly roundHistoryStore: RoundHistoryStore,
        @inject(RoundTimeStore) protected readonly roundTimeStore: RoundTimeStore,
        @inject(MainPlayerStore) protected readonly mainPlayerStore: MainPlayerStore,
        @inject(SettlementStore) protected readonly settlementStore: SettlementStore
    ) {
        super(gameConfigStore, roundHistoryStore, roundTimeStore, mainPlayerStore, settlementStore);

        makeObservable(this, {
            drawId: observable,
            odds: observable,
            turnCounter: observable,
            turnObject: observable,
            roundData: observable,

            setRoundData: action
        });
    }

    setRoundData(roundData: GameServiceMessage.TurnBaseGameRoundData) {
        this.roundData = roundData;
    }

    override set clientRoundId(drawId: number) {
        this._clientRoundId = drawId;
    }

    override get clientRoundId() {
        const currentFinish = this.settlementStore.currentFinish;
        if (!currentFinish || this.historyRoundId >= currentFinish.drawId) {
            return this.historyRoundId;
        }
        return currentFinish.drawId;
    }

    override get historyRoundId() {
        let lastRoundId = 0;

        if (this.roundHistoryStore.histories.length > 0) {
            lastRoundId = this.roundHistoryStore.histories[0].drawId;
        }

        if (
            this.roundTimeStore.roundState === TURN_ROUND_STATE.STARTING_ROUND ||
            this.roundTimeStore.roundState === TURN_ROUND_STATE.PLACING_BET ||
            this.roundTimeStore.roundState === TURN_ROUND_STATE.LOCKING_BET ||
            this.roundTimeStore.roundState === TURN_ROUND_STATE.WAITING
        ) {
            lastRoundId++;
        }

        // when clearing all active data in database and having data in archive collection
        if (this.roundHistoryStore.histories.length === 0 && this.drawId > 0) {
            lastRoundId = this.drawId;
        }

        if (this._clientRoundId < lastRoundId) {
            this.clientRoundId = lastRoundId;
        }
        return this._clientRoundId;
    }


    override get roundOdds(): RoundOdds {
        return {
            odds: this.odds,
            fractional: this.mainPlayerStore.fractionalOddsFormat
        }
    }
}
