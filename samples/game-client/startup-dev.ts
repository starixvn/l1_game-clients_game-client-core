import "reflect-metadata";
import { container, startup } from "../../src/index";
import { PlayerStore } from "../../src/players";
import { SocketIOConnectHandler } from "../../src/socket-io";
import { reaction, makeAutoObservable } from "mobx";
import { RoundTimeStore } from "../../src/core/round-time/round-time-store";

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
// reaction(
//   () => playerStore.stakeLevel,
//   (stakeLevel) => {
//     console.log(
//       `Max Bet: ${stakeLevel.maxBet}, Min Bet: ${
//         stakeLevel.minBet
//       } - ${new Date()}`
//     );
//   }
// );

const roundTimeStore = container.resolve(RoundTimeStore);
roundTimeStore.wholeRound = 39;
roundTimeStore.placingBet = 30;
roundTimeStore.lockingBet = 5;
// roundTimeStore.s: 2,
reaction(
  () => roundTimeStore.roundTime,
  (roundTime) => {
    console.log({ ...roundTimeStore.toJSON() });
  }
);
