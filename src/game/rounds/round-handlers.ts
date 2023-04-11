import { inject, injectable } from "inversify";
import { GameServiceMessage, IMultipleHandlers } from "../../shared";
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
