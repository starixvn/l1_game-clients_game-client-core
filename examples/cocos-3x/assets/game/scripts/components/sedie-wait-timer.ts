import { _decorator } from "cc";
import WaitTimer from "db://shared-components/game-timer/wait-timer";
import Observer from "observer";

import { settings } from "../sedie-settings";

const { ccclass } = _decorator;
const { observer, handle, render } = Observer;

@ccclass
@observer(settings.name)
export default class SedieTimer extends WaitTimer {}
