export namespace GameClientEmitMessage {
    export class Signin {
        isAuthenticated: boolean;
        umInfo: string;
        username: string;
        language: string;
        ss: string;
        system: number;
        memberName: string;
        isUM: boolean;
        time: string;
        currency: string;

        static eventName = "signin";
    }
    export class Bet {
        amount: number;
        username: string;
        m: number;
        freeBet: boolean;
        betChoice: string;

        static eventName = "bet";
    }

    export const inGame = "inGame";

    export class BetHistory {
        page: number;

        static eventName = "getHistory";
    }
}

export namespace GameServiceMessage {
    export const toGame = "toGame";

    export class User {
        name: string;
        UID: number;
        avatarId: number;
        currency: string;
        joinedOn: string;
        red: number;
        scoins?: number;
        type: boolean;
        rate?: number;
        minBet: number;
        maxBet: number;
        offerGames?: { gameId: number }[];
        availSpins?: number;
        fractionalOddsFormat?: boolean;
        isDisplayPlayerCurrency?: boolean;

        static eventName = "user";
    }

    export class UserStakeLevel {
        minBet: number;
        maxBet: number;

        static eventName = "userStakeLevel";
    }
    export const remainingTime = "remainingTime";
    export const um = "um";
    export const notPermittedToPlay = "notPermittedToPlay";

    export const roundId = "roundId";
    export type Odds = {
        [betChoice: string]: number;
    };

    class Bets {
        [betChoice: string]: number;
    }

    export class OwnBets extends Bets {
        static eventName = "ownBets";
    }

    export class TotalBets extends Bets {
        static eventName = "totalBets";
    }

    export type MaxBetPerChoices = Odds;

    export class GameConfigs {
        minBet: number;
        maxBet: number;
        maxBetPerChoices: MaxBetPerChoices;
        chips: string[];
        stakeLevels: string[];
        odds: Odds;
        enableFreeBet: boolean;
        originalOdds?: Odds;
        boostedChoices?: Odds;

        static eventName = "gameConfigs";
    }

    export const roundHistory = "roundHistory";
    export const ownBets = "ownBets";
    export const totalBets = "totalBets";

    export class Chips {
        [rate: string]: {
            [betChoice: string]: {
                [chipValue: string]: number;
            };
        };

        static eventName = "chips";
    }

    export class OwnChip {
        betChoice: string;
        amount: number;

        static eventName = "ownChip";
    }
    export class OutGame {
        playerId: string;

        static eventName = "outgame";
    }
    export class PlayerChip {
        playerId: string;
        betChoice: string;
        amount: number;
        red: number;

        static eventName = "playerChip";
    }
    export class AroundTablePlayer {
        id: string;
        name: string;
        red: number;
        avatarId: number;
        type: boolean;

        static eventName = "player";
    }

    export class AroundTablePlayers {
        [playerId: string]: AroundTablePlayer;

        static eventName = "players";
    }

    export class ResultHash {
        rawValue?: string;
        extraInfos?: any;
        hashValue?: string;

        static eventName = "resultHash";
    }

    export class BetResponse {
        static eventName = "endBet";
    }

    export class Notice {
        errorCode: string;
        hedgeBetGroup?: string[];
        minBet?: number;
        maxBet?: number;
        gameRoundId?: number;
        gameTypeId?: number;
        isPlaceBetFailed?: boolean;
        static eventName = "notice";
    }

    export class ApiError extends Notice {
        static eventName = "apiError";
    }

    export const betChoice = "betChoice";
    export const freeBet = "freeBet";
    export type WinningByChoices = Odds;

    export class Status {
        winningByChoices: WinningByChoices;
        win: boolean;
        bet: number;

        static eventName = "status";
    }
    export class Finish {
        result?: TResult;
        settlementResult?: TSettlementResult;
        roundId?: number;
        winningPlayers?: TWinningPlayers;

        static eventName = "finish";
    }

    export type TResult = {
        [betChoice: string]: unknown;
    };

    export type TSettlementResult = {
        [betChoice: string]: boolean;
    };

    export type TWinningPlayers = {
        [playerId: number]: {
            bet: number;
            rate: number;
            win: boolean;
            winningByChoices: GameServiceMessage.Odds;
        };
    };

    export const spb = "spb";
    export const snr = "snr";
    export const epb = "epb";

    export class DisabledGameInfo {
        "vi-VN": string;
        "en-US": string;
        "zh-CN": string;
        "zh-TW": string;
        "th-TH": string;
        "id-ID": string;

        static eventName = "um_message";
    }

    export class BetHistory {
        static eventName = "history";
    }
}

export namespace NotificationServiceMessage {
    class UMInfo {
        isUM: boolean;
        operatorId: string;
        startTime: Date;
        endTime: Date;
    }

    export class UnderMaintenanceInfo {
        message: string;
        umInfo: UMInfo;
        static eventName = "notifyKickedOut";
    }

    export const sessionTimeoutEventName = "notifyTimeout";

    export const reloadEventName = "reload";
}
