import { inject, injectable } from "inversify";
import { Mediator } from "../common";

@injectable()
export class CoreModule {
  constructor(@inject(Mediator) mediator: Mediator) {
    //mediator.registerHandlers([syncPlayerProfile, syncStakeLevel]);
  }
}
