import "reflect-metadata";
import { IContainer } from "./../../../src/common/interface";
import { GameStore } from "../../../src/core/game-store";
import { container, startup } from "../../../src/index";
import { PlayerStore } from "../../../src/players";
import { SocketIOConnector } from "../../../src/socket-io";
import { reaction, makeAutoObservable } from "mobx";
import { RoundTimeStore } from "../../../src/core/round-time/round-time-store";

const gameName = "sedie";
function makeObservableFn(...params: any[]) {
  makeAutoObservable(params[0]);

  console.log(params[0]);
}
container.bind("makeObservable").toFunction(makeObservableFn);
container.bind("roundTimeSetting").toConstantValue({
  wholeRound: 39,
  lockingBet: 5,
  placingBet: 30,
  genResult: 2,
});

startup(container as IContainer);

(function connectToServer() {
  const handler = container.resolve(SocketIOConnector);

  handler.handle({
    socketUri: "http://localhost:3000",
    gameName,
  });
})();

const player = container.resolve(PlayerStore);
player.name = "ricky.nguyen";
player.ss = "ricky-ss";
player.signIn();

const roundTimeStore = container.resolve(RoundTimeStore);
reaction(
  () => roundTimeStore.roundTime,
  (roundTime) => {
    console.log({ ...roundTimeStore.toJSON() });
  }
);

const gameStore = container.resolve(GameStore);
gameStore.gameName = gameName;
gameStore.startGame();
