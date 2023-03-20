import { PlayerHandlers } from "./player-handlers";
import { inject, injectable } from "inversify";
import { Mediator } from "../common";

@injectable()
export class PlayerModule {
  constructor(
    @inject(Mediator) mediator: Mediator,
    @inject(PlayerHandlers) playerHandlers: PlayerHandlers
  ) {
    mediator.registerHandlers(playerHandlers);
  }
}
