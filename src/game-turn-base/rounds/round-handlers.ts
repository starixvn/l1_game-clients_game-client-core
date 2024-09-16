import { inject, injectable } from "inversify";

import { GameServiceMessage, IMultipleHandlers } from "../../shared";
import { RoundStore } from "./round-store";
import { GameSetting, TurnBaseDurationSetting } from "../../game/game-configs";
import { RoundTimeStore } from "./round-time-store";
import { GameTurnBaseServiceMessage } from "../game-turn-base-messages";

export class TurnTimeline {
    /**
     *
     */
    constructor(public turnIndex: number, public placingBet: TimelineRange, public displayResult: TimelineRange) {
        this.placeBetDuration = this.placingBet.startTime - this.placingBet.endTime;
        this.displayResultDuration = this.displayResult.startTime - this.displayResult.endTime;
    }

    placeBetDuration: number;
    displayResultDuration: number;

    isInPlacingBetTime = (roundRemainingTime: number) => {
        return roundRemainingTime <= this.placingBet.startTime && roundRemainingTime >= this.placingBet.endTime;
    };

    isInDisplayingResultTime = (roundRemainingTime: number) => {
        return roundRemainingTime <= this.displayResult.startTime && roundRemainingTime >= this.displayResult.endTime;
    };
}

type TimelineRange = {
    startTime: number;
    endTime: number;
};

export type Turn = {
    id: number;
    index: number;
};

export class TurnTimelineCounter {
    allTurnTimeline: TurnTimeline[] = [];
    totalTurn = 0;

    /**
     *
     */
    constructor(private readonly durations: TurnBaseDurationSetting) {
        this.calculateTurnTimeline();
    }

    calculateTurnTimeline = () => {
        const wholeRoundWithoutSwitchRoundAmimation = this.durations.wholeRound - this.durations.switchRoundAnimation;
        this.totalTurn = wholeRoundWithoutSwitchRoundAmimation / this.durations.wholeTurn;
        const showResult = this.durations.showingResult + this.durations.startRound;
        let allTurnRemainingTime = wholeRoundWithoutSwitchRoundAmimation - showResult;
        for (let turnIndex = 1; turnIndex <= this.totalTurn; turnIndex++) {
            const startPlacingBet = allTurnRemainingTime;
            const endPlacingBet = (allTurnRemainingTime -= this.durations.placingBet);
            let startDisplayResult = allTurnRemainingTime;
            let endDisplayResult = (allTurnRemainingTime -= showResult);
            endDisplayResult += 1;

            if (startDisplayResult <= 0) {
                startDisplayResult = this.durations.wholeRound;
                endDisplayResult = startDisplayResult - this.durations.switchRoundAnimation - showResult + 1;
            }

            const turnTimeline: TurnTimeline = new TurnTimeline(
                turnIndex,
                { startTime: startPlacingBet, endTime: endPlacingBet },
                { startTime: startDisplayResult, endTime: endDisplayResult }
            );

            this.allTurnTimeline.push(turnTimeline);
        }
    };

    calculateTurn = (roundRemainingTime: number, roundId?: number, turnId?: number) => {
        const turn: Turn = {
            id: 0,
            index: 0,
        };

        for (const turnTimeline of this.allTurnTimeline) {
            if (turnTimeline.isInPlacingBetTime(roundRemainingTime) || turnTimeline.isInDisplayingResultTime(roundRemainingTime)) {
                return this.calculateTurnIndexAndId(turn, turnTimeline, roundId, roundRemainingTime, turnId);
            }
        }

        return turn;
    };

    isLastTurn = (roundRemainingTime: number, turnTimeline: TurnTimeline) => {
        return turnTimeline.turnIndex === this.totalTurn && turnTimeline.isInDisplayingResultTime(roundRemainingTime);
    };

    private calculateTurnIndexAndId(turn: Turn, turnTimeline: TurnTimeline, roundId: number, roundRemainingTime: number, turnId: number) {
        turn.index = turnTimeline.turnIndex;

        if (roundId > 0) {
            const actualRoundId = this.isLastTurn(roundRemainingTime, turnTimeline) ? roundId - 1 : roundId;
            turn.id = (actualRoundId - 1) * this.totalTurn + turn.index;
        }

        return turn;
    }
}

@injectable()
export class RoundHandlers implements IMultipleHandlers {
    private _totalTurn = 1;
    private shouldRunWhenFirstLoad = false;
    private roundRemainingTime = 0;
    private roundId = 0;
    private readonly turnTimelineCounter: TurnTimelineCounter;

    constructor(
        @inject(RoundStore) protected readonly store: RoundStore,
        @inject(RoundTimeStore) protected readonly roundTimeStore: RoundTimeStore,
        @inject(GameSetting) readonly gameSetting: GameSetting) {
        this.shouldRunWhenFirstLoad = true;
        this._totalTurn = gameSetting.totalTurns;

        this.turnTimelineCounter = new TurnTimelineCounter(gameSetting.durations);
    }


    handleRemainingTime = (remainingTime: number) => {
        if (this.shouldRunWhenFirstLoad) {
            this.roundRemainingTime = remainingTime;
        }
    };

    handleDrawId(drawId: number) {
        const turnIndex = drawId % this._totalTurn;
        let turnCounter = turnIndex === 0 ? this._totalTurn : turnIndex;

        this.store.clientRoundId = drawId;
        this.store.turnCounter = turnCounter;
        console.log({ drawId, turnCounter });

        if (this.shouldRunWhenFirstLoad) {
            this.shouldRunWhenFirstLoad = false;
            const turn = this.turnTimelineCounter.calculateTurn(this.roundRemainingTime, this.roundId, drawId);
            turnCounter = turn.index;

        }
        //  else if (!this.roundTimeStore.isInDisplayResultState()) {
        //     this.store.turnObject = {
        //         id: drawId,
        //         index: turnCounter,
        //     }
        // }


    }

    handleOdds(odds: GameServiceMessage.Odds) {
        this.store.Odds = odds;
    }

    eventHandleList = [
        {
            name: GameServiceMessage.remainingTime,
            handle: this.handleRemainingTime,
        },
        {
            name: GameTurnBaseServiceMessage.drawId,
            handle: this.handleDrawId,
        },
        {
            name: GameTurnBaseServiceMessage.odds,
            handle: this.handleOdds,
        },
    ];
}
