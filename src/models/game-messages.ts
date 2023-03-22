export interface IGameClientEmitMessage {
  signin: {
    isAuthenticated: boolean;
    umInfo: string;
    username: string;
    language: string;
    ss: string;
    system: number;
    memberName: string;
    isUM: boolean;
    time: string;
  };
  bet: {
    amount: number;
    username: string;
    m: number;
    freeBet: boolean;
    betChoice: string;
  };
  inGame: any;
  getHistory: { page: number };
}

export interface IGameServiceMessage {
  toGame: string;
  userStakeLevel: { minBet: number; maxBet: number };
  remainingTime: number;
  um: false;
  um_message: {
    "vi-VN": string;
    "en-US": string;
    "zh-CN": string;
    "zh-TW": string;
    "th-TH": string;
    "id-ID": string;
  };
  roundId: number;
  gameConfigs: {
    groupId: string;
    minBet: number;
    maxBet: number;
    maxBetPerChoices: any;
    chips: string[];
    stakeLevels: [];
    odds: any;
    enableFreeBet: boolean;
  };
  odds: {
    boostedChoices: Array<any>;
    values: any;
  };
  roundHistory: Array<{
    roundId: number;
    result: any;
    settlementResult: any;
  }>;
  ownBets: any;
  totalBets: any;
  user: {
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
  };

  ownChip: { betChoice: string; amount: number };
  outgame: { playerId: string };
  playerChip: {
    playerId: string;
    betChoice: string;
    amount: number;
    red: number;
  };
  player: {
    id: string;
    name: string;
    red: number;
    avatarId: number;
    type: boolean;
  };
  resultHash: {
    rawValue: string;
    extraInfos: any;
  };
  endBet: number;
  betChoice: string;
  freeBet: boolean;
  status: {
    winningByChoices: any;
    win: boolean;
    bet: number;
  };
  finish: {
    result: any;
    settlementResult: any;
    roundId: number;
  };
  spb: boolean;
  snr: boolean;
  epb: boolean;
}
