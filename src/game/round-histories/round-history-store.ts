import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { GameServiceMessage } from "../../shared";
import { GameSetting } from "../game-configs";
import { ROUND_STATE, RoundTimeStore } from "../rounds/round-time-store";

export interface RoundHistory {
    roundId: number;
    result: GameServiceMessage.TResult;
    settlementResult: GameServiceMessage.TSettlementResult;
    winningPlayers?: GameServiceMessage.TWinningPlayers;
}

export interface IRoundHistoryInfo {
    roundHistory: RoundHistory;
    isShow?: boolean;
}

@injectable()
export class RoundHistoryStore {
    constructor(
        @inject(RoundTimeStore) protected readonly roundTimeStore: RoundTimeStore,
        @inject(GameSetting) protected readonly gameSetting: GameSetting
    ) {
        makeAutoObservable(this, { joinGameHistory: false });
    }

    private _histories: RoundHistory[] = [];
    joinGameHistory: IRoundHistoryInfo = null;

    get histories() {
        return this._histories;
    }

    set histories(histories: RoundHistory[]) {
        this._histories = histories;
    }

    getLastRound() {
        return this.histories?.[0];
    }

    updateHistories(finish: GameServiceMessage.Finish) {
        const currentRound = finish as RoundHistory;
        const cloneHistories = JSON.parse(JSON.stringify(this.histories));
        cloneHistories.unshift(currentRound);
        if (cloneHistories.length > this.gameSetting.numberOfRoundHistory) {
            cloneHistories.pop();
        }

        this.histories = cloneHistories;
    }

    get joinRoomShowResult(): IRoundHistoryInfo | null {
        if (!this.joinGameHistory && this._histories.length > 0 && this.roundTimeStore.roundState !== ROUND_STATE.STOP_GAME_LOOP) {
            const roundState = this.roundTimeStore.roundState;
            const isShow = roundState === ROUND_STATE.SHOW_ANIMATION_RESULT || roundState === ROUND_STATE.SHOW_RESULT;
            this.joinGameHistory = {
                roundHistory: this.getLastRound(),
                isShow: isShow,
            };
        }

        return this.joinGameHistory;
    }
}
