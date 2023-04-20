import { _decorator } from "cc";
import BetTimer from "db://shared-components/game-timer/bet-timer";
import Observer from "observer";

import { settings } from "../sedie-settings";

const { ccclass } = _decorator;
const { observer, handle, render } = Observer;

@ccclass
@observer(settings.name)
export default class SedieBetTimer extends BetTimer {}
