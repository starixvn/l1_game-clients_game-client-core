import { Container } from "inversify";
import { IContainer, registerModule } from "./common";
import players from "./players";
import socketIO from "./socket-io";
import core from "./core";
import { UserService } from "./auth/user-service";

export function registerSharedModules(
  container: Container,
  userServiceUrl: string
) {
  registerModule(container, players);
  container.bind(UserService).toConstantValue(new UserService(userServiceUrl));
}

export function registerGameModules(container: IContainer) {
  registerModule(container, socketIO);
  registerModule(container, core);
}
