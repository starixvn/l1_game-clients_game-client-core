import { IMultipleHandlers } from "../../common/mediator";
import { inject, injectable } from "inversify";
import { GameServiceMessage } from "../../models/game-messages";
import { RoundStore } from "./round-store";

@injectable()
export class RoundHandlers implements IMultipleHandlers {
  constructor(@inject(RoundStore) protected readonly store: RoundStore) {}

  handleRoundId(roundId: number) {
    if (roundId > 0) {
      this.store.roundId = roundId;
    }
  }

  eventHandleList = [
    {
      name: GameServiceMessage.roundId,
      handle: this.handleRoundId.bind(this),
    },
  ];
}
