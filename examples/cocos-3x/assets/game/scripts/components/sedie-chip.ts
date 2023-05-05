import { _decorator } from "cc";
import Chip from "db://shared-components/sliding-chip/scripts/components/chip";
import Observer from "observer";

import { settings } from "../sedie-settings";

const { ccclass } = _decorator;
const { observer, handle, render } = Observer;

@ccclass
@observer(settings.name)
export default class SedieChip extends Chip {}
