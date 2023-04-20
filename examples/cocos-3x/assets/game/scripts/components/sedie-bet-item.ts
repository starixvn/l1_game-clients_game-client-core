import { _decorator } from "cc";
import BetItem from "db://shared-components/bet-item/bet-item";
import Observer from "observer";

import { settings } from "../sedie-settings";

const { ccclass } = _decorator;
const { observer, handle, render } = Observer;

@ccclass
@observer(settings.name)
export default class SedieBetItem extends BetItem {}
