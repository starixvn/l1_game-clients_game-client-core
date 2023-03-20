import { RoundTimeHandlers } from "./round-time/round-time-handlers";
import { inject, injectable } from "inversify";
import { Mediator } from "../common";

@injectable()
export class CoreModule {
  constructor(
    @inject(Mediator) mediator: Mediator,
    @inject(RoundTimeHandlers) roundTimeHandlers: RoundTimeHandlers
  ) {
    mediator.registerHandlers(roundTimeHandlers);
  }
}
