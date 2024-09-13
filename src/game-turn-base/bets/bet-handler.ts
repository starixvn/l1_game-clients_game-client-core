import { injectable } from "inversify";

import { BetHandlerBase } from "./bet-handler-base";

export interface IBetInfo {
    betChoice: string;
    amount: number;
}

@injectable()
export class BetHandler extends BetHandlerBase {
    handle(betInfo: IBetInfo) {
        const betChoices: Record<string, number> = {
            [betInfo.betChoice]: betInfo.amount
        }
        const betData = this.createBetData({ betChoices });
        console.log({ betData });
        this.handleBetData(betData);
    }
}
