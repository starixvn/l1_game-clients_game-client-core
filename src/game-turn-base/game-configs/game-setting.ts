import type { DurationSetting } from "../../game/game-configs";
import { GameSetting as GameSettingBase } from "../../game/game-configs/game-setting";

export type TurnBaseDurationSetting = DurationSetting & {
    wholeTurn?: number;
    resultAnimation?: number;
    switchRoundAnimation?: number;
    startNewRoundAnim?: number;
};

export class GameSetting extends GameSettingBase {
    durations: TurnBaseDurationSetting;
    totalTurns?: number;
}
