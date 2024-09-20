import { inject, injectable } from "inversify";

import { GameServiceMessage } from "../../shared";
import { RoundStore } from "./round-store";
import { GameSetting } from "../../game/game-configs";
import { RoundTimeStore } from "./round-time-store";
import { GameTurnBaseServiceMessage } from "../game-turn-base-messages";
import { RoundHandlers as RoundHandlersBase } from "../../game/rounds";
import { BetStore } from "../../game/bets";

@injectable()
export class RoundHandlers extends RoundHandlersBase {
    constructor(
        @inject(RoundStore) protected readonly store: RoundStore,
        @inject(BetStore) protected readonly betStore: BetStore,
        @inject(RoundTimeStore) protected readonly roundTimeStore: RoundTimeStore,
        @inject(GameSetting) readonly gameSetting: GameSetting) {
        super(store);
    }

     handleOwnChip(ownChip: GameTurnBaseServiceMessage.OwnChip) {
        this.betStore.betChoice =Object.keys(ownChip.betChoices)[0]
    }

    handleDrawId(drawId: number) {
        this.store.setClientRoundId(drawId);
    }

    handleOdds(odds: GameServiceMessage.Odds) {
        this.store.odds = odds;
    }

    handleRoundData(roundData: GameServiceMessage.TurnBaseGameRoundData) {
        this.store.roundData = roundData;
    }

    handleFinish(finish: GameServiceMessage.Finish | undefined) {
        const result = finish?.result as GameServiceMessage.LuckyNextResult;
        const resultRoundData = {
            balls: [result?.ball],
        };

        this.store.roundData = {
            balls: this.store.roundData?.balls?.concat(resultRoundData.balls) || resultRoundData.balls,
            drawId: result?.drawId,
        };
    }

    eventHandleList = [
        {
            name: GameTurnBaseServiceMessage.drawId,
            handle: this.handleDrawId,
        },
        {
            name: GameTurnBaseServiceMessage.odds,
            handle: this.handleOdds,
        },
        {
            name: GameServiceMessage.TurnBaseGameRoundData.eventName,
            handle: this.handleRoundData,
        },
        {
            name: GameServiceMessage.Finish.eventName,
            handle: this.handleFinish,
        },
        {
            name: GameTurnBaseServiceMessage.OwnChip.eventName,
            handle: this.handleOwnChip,
        },
    ];
}
