import { IContainer, registerModule } from "./common";
import players from "./players";
import socketIO from "./socket-io";

export function startup(container: IContainer) {
  registerModule(container, players);
  registerModule(container, socketIO);
}
