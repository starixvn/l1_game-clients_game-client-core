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

  export class GetHistory {
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
    scoins: number;
    type: boolean;
    rate: number;
    minBet: number;
    maxBet: number;
    offerGames?: any;
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
  export class UmMessage {
    "vi-VN": string;
    "en-US": string;
    "zh-CN": string;
    "zh-TW": string;
    "th-TH": string;
    "id-ID": string;

    static eventName = "um_message";
  }
  export const roundId = "roundId";
  export class GameConfigs {
    minBet: number;
    maxBet: number;
    maxBetPerChoices: any;
    chips: string[];
    stakeLevels: [];
    odds: any;
    enableFreeBet: boolean;
    originalOdds?: any;
    boostedChoices?: any;

    static eventName = "gameConfigs";
  }
  export class Odds {
    boostedChoices: Array<any>;
    values: any;

    static eventName = "odds";
  }
  export const roundHistory = "roundHistory";
  export const ownBets = "ownBets";
  export const totalBets = "totalBets";

  export class OwnChip {
    betChoice: string;
    amount: number;

    static eventName = "ownChip";
  }
  export class Outgame {
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
  export class Player {
    id: string;
    name: string;
    red: number;
    avatarId: number;
    type: boolean;

    static eventName = "player";
  }
  export class ResultHash {
    rawValue: string;
    extraInfos: any;

    static eventName = "resultHash";
  }
  export const endBet = "endBet";
  export const betChoice = "betChoice";
  export const freeBet = "freeBet";
  export class Status {
    winningByChoices: any;
    win: boolean;
    bet: number;

    static eventName = "status";
  }
  export class Finish {
    result: any;
    settlementResult: any;
    roundId: number;

    static eventName = "finish";
  }
  export const spb = "spb";
  export const snr = "snr";
  export const epb = "epb";
}
