import { Container } from "inversify";
import { UserService } from "./auth/user-service";
import game from "./game";
import players from "./players";
import { IContainer, registerModule } from "./shared";
import socketIO from "./socket-io";

export function registerSharedModules(
  container: Container,
  userServiceUrl: string
) {
  registerModule(container, players);
  container.bind(UserService).toConstantValue(new UserService(userServiceUrl));
}

export function registerGameModules(container: IContainer) {
  registerModule(container, socketIO);
  registerModule(container, game);
}
