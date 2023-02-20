import { AnyConstructor, IContainer } from "./interface";

export function registerModule(container: IContainer, module: AnyConstructor) {
  container.resolve(module);
}
