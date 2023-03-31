import { IContainer, registerModule } from "./common";
import players from "./players";
import socketIO from "./socket-io";
import core from "./core";

export function registerSharedModules(container: IContainer) {
  registerModule(container, players);
}

export function registerGameModules(container: IContainer) {
  registerModule(container, socketIO);
  registerModule(container, core);
}
