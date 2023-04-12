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
    };
    choices?: string[];
    hedgeBetGroups?: string[][];
}
