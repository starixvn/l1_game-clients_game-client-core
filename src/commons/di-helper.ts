import { AnyConstructor, IContainer } from "./interface";
import { Mediator } from "./mediator";
import { IListener, IModule } from "./module";

export function registerListeners(
  container: IContainer,
  listeners: AnyConstructor<IListener<any>>[]
) {
  const mediator = container.resolve(Mediator);

  listeners.forEach((listenerCtor) => {
    const listener = container.resolve(listenerCtor);

    listener.properties.forEach((property) => {
      mediator.on(property, listener.handle.bind(listener));
    });
  });
}

export function registerModule(container: IContainer, module: IModule) {
  registerListeners(container, module.listeners);
}
