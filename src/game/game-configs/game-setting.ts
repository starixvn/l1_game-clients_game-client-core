export class GameSetting {
    id: number;
    name: string;
    configName?: string;
    durations: {
        wholeRound: number;
        placingBet: number;
        lockingBet: number;
        showingResult?: number;
        generatingResult?: number;
        startRound?: number;
    };
    choices?: string[];
    hedgeBetGroups?: string[][];
    numberOfRoundHistory: number;
    validateBalanceWhenBet?: boolean;
}
