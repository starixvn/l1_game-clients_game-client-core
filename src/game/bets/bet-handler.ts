import { injectable } from "inversify";

import { BetHandlerBase } from "./bet-handler-base";

@injectable()
export class BetHandler extends BetHandlerBase {
    handle(betChoice: string) {
        const betData = this.createBetData({ betChoice });
        this.handleBetData(betData);
    }
}
