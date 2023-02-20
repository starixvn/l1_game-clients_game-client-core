import { IContainer, registerModule } from "./common";
import players from "./players";
import socketIO from "./socket-io";
import core from "./core";

export function startup(container: IContainer) {
  registerModule(container, players);
  registerModule(container, socketIO);
  registerModule(container, core);
}
