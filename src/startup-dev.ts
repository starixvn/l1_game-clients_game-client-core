import "reflect-metadata";
import { container, startup } from "./index";
import { PlayerStore } from "./players";
import { SocketIOConnectHandler } from "./socket-io";
import { reaction, makeAutoObservable } from "mobx";

function makeObservableFn(...params: any[]) {
  makeAutoObservable(params[0]);

  console.log(params[0]);
}

function connectToServer() {
  const handler = container.resolve(SocketIOConnectHandler);

  handler.handle({
    socketUri: "http://localhost:3000",
    gameName: "sedie",
  });
}

container.bind("makeObservable").toFunction(makeObservableFn);

startup(container);

connectToServer();

const playerStore = container.resolve(PlayerStore);

console.log(`Max Bet: ${playerStore.stakeLevel.maxBet} - ${new Date()}`);

reaction(
  () => playerStore.stakeLevel,
  (stakeLevel) => {
    console.log(
      `Max Bet: ${stakeLevel.maxBet}, Min Bet: ${
        stakeLevel.minBet
      } - ${new Date()}`
    );
  }
);
