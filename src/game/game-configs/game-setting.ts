export type DurationSetting = {
    wholeRound: number;
    placingBet: number;
    lockingBet: number;
    showingResult?: number;
    generatingResult?: number;
    startRound?: number;
    wholeShoe?: number;
};


export type TurnBaseDurationSetting = DurationSetting & {
    wholeTurn?: number;
    resultAnimation?: number;
    switchRoundAnimation?: number;
    startNewRoundAnim?: number;
}


export class GameSetting {
    id: number;
    name: string;
    configName?: string;
    durations: DurationSetting | TurnBaseDurationSetting;
    choices?: string[];
    hedgeBetGroups?: string[][];
    numberOfRoundHistory: number;
    validateBalanceWhenBet?: boolean;
    durationShowPromptMessage?: number;
    totalTurns?: number;
}
