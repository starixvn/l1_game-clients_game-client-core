import { IContainer, registerModule } from "./commons";
import players from "./players";

export function startup(container: IContainer) {
  registerModule(container, players);
}
