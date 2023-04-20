import { _decorator } from "cc";
import GameClient from "game-client-base";
import Observer from "observer";

import TwoDigitsTimer from "./two-digits-timer";

const { Rounds } = GameClient;
const { RoundTimeStore } = Rounds;
const { ccclass, property } = _decorator;
const { observer, render, handle } = Observer;
export default class BetTimer extends TwoDigitsTimer {
    @render(RoundTimeStore, (store) => store.countdownTimer)
    setTime(time: number) {
        super.setTime(time);
    }

    @render(RoundTimeStore, (store) => store.roundState)
    setState(state: string) {
        this.node.active =
            state === Rounds.ROUND_STATE.BEGIN_PLACING_BET ||
            state === Rounds.ROUND_STATE.PLACING_BET ||
            state === Rounds.ROUND_STATE.BEGIN_LOCKING_BET ||
            state === Rounds.ROUND_STATE.LOCKING_BET;
        super.setState(state);
    }
}
