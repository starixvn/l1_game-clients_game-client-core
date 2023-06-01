import { injectable } from "inversify";
import { GameServiceMessage, IHandler } from "../../shared";

@injectable()
export class BetHistoryHandlers implements IHandler<void> {
    name = GameServiceMessage.BetHistory.eventName;

    constructor() {}

    handle() {}
}
