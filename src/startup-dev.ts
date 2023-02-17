import "reflect-metadata";
import { container, startup } from "./index";
import { SocketIOConnectHandler } from "./socket-io";

function makeObservable(...params: any[]) {
  console.log(params);
}

function connectToServer() {
  const handler = container.resolve(SocketIOConnectHandler);

  handler.handle({ path: "" });
}

container.bind("makeObservable").toFunction(makeObservable);

startup(container);

setTimeout(() => {
  connectToServer();
}, 5000);
