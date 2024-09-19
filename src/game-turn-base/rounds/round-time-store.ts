import { inject, injectable } from "inversify";
import { GameSetting, TurnBaseDurationSetting } from "../../game/game-configs";
import { ROUND_STATE, RoundTimeStore as RoundTimeStoreBase } from "../../game/rounds";

export const TURN_ROUND_STATE = {
    ...ROUND_STATE,
    SWITCH_ROUND: "SwitchRound"
};

const RoundTimeInitValue = -99999;

@injectable()
export class RoundTimeStore extends RoundTimeStoreBase {
    private _durations: TurnBaseDurationSetting = null;
    totalRoundTime = RoundTimeInitValue;

    constructor(@inject(GameSetting) readonly gameSetting: GameSetting) {
        super(gameSetting);
        this._durations = this.gameSetting.durations as TurnBaseDurationSetting
    }

    get TotalTurns() {
        return this._durations.wholeTurn || 1;
    }

    get wholeTurn() {
        return this._durations.wholeTurn || 0;
    }

    get switchRoundAnimation() {
        return this._durations.switchRoundAnimation;
    }

    override resetRoundTime() {
        this.roundTime = this.wholeTurn;
    }

    get isSwitchRoundInTurn() {
        if (this.wholeRound > 0) {
            const startSwitchRoundPointTime = this.wholeRound - this.showingResult;
            const endSwitchRoundPointTime = startSwitchRoundPointTime - this.switchRoundAnimation;
            // console.log({ startSwitchRoundPointTime, endSwitchRoundPointTime, remainingTime: this._remaining, roundTime: this.roundTime });

            if (startSwitchRoundPointTime >= this.totalRoundTime && this.totalRoundTime > endSwitchRoundPointTime) {

                // console.log({ remaining: this._remaining });
                // console.log({ roundTime: this.roundTime });
                // console.log("%cisSwitchRoundInTurn", "color: red; font-size:18px; font-weight: bold");
                return true;
            }
        }

        return false;
    }

    getRemainingTime(totalRoundTime: number): number {
        const turnRemainingTime =
            this.getRoundRemainingTimeToCalculateTurnRemainingTime(totalRoundTime) % this._durations.wholeTurn;

        // console.log(`turn base RemainingTime: ${turnRemainingTime}`)

        return turnRemainingTime <= 0 ? this._durations.wholeTurn : turnRemainingTime;
    }

    getRoundRemainingTimeToCalculateTurnRemainingTime(remainingTime: number): number {
        const { wholeRound, showingResult, switchRoundAnimation, startRound } = this._durations;
        const startSwitchRoundPointTime = wholeRound - showingResult;
        const endSwitchRoundPointTime = startSwitchRoundPointTime - switchRoundAnimation;

        if (remainingTime > startSwitchRoundPointTime) {
            return remainingTime - switchRoundAnimation;
        }

        if (startSwitchRoundPointTime >= remainingTime && remainingTime > endSwitchRoundPointTime - startRound) {
            return endSwitchRoundPointTime - startRound;
        }

        return remainingTime;
    }

    override countdown() {
        if (this.totalRoundTime <= 1) {
            this.totalRoundTime = 0;
        } else {
            this.totalRoundTime--;
        }

        console.log(`--------------------`)
        console.log(`totalRoundTime: ${this.totalRoundTime}`)
        this.roundTime = this.getRemainingTime(this.totalRoundTime);
        this.calculateRoundStatus();
    }


    override getCurrentRoundState(): string {
        if (this.roundTime < 0) {
            return ROUND_STATE.WAITING;
        }


        if (this.isSwitchRoundInTurn) {
            return TURN_ROUND_STATE.SWITCH_ROUND;
        }

        return super.getCurrentRoundState();
    }

    isInDisplayResultState() {
        return this.roundState === TURN_ROUND_STATE.SHOW_RESULT || this.roundState === TURN_ROUND_STATE.STARTING_ROUND;
    }
}
