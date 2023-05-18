import { _decorator } from "cc";
import Observer from "observer";
import BetItem from "../../../../extensions/shared-components/assets/bets/scripts/components/bet-item";

import { settings } from "../sedie-settings";

const { ccclass } = _decorator;
const { observer, handle, render } = Observer;

@ccclass
@observer(settings.name)
export default class SedieBetItem extends BetItem {}
