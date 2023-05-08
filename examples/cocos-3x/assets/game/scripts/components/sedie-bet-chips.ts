import { _decorator } from "cc";
import BetChips from "db://shared-components/sliding-chip/scripts/components/bet-chips";
import Observer from "observer";

import { settings } from "../sedie-settings";

const { ccclass } = _decorator;
const { observer, handle, render } = Observer;

@ccclass
@observer(settings.name)
export default class SedieBetChips extends BetChips {}
