import { SocketClientMock, SocketServerMock } from "socket.io-mock-ts";
import { ConnectionStore } from "../../../src/game/connection";
import { container } from "./container";
import { gameData } from "./game-data";
import { normalPlayer } from "./player";
import { gameSettings } from "./setting";

let socket: SocketServerMock;
let socketClient: SocketClientMock;

export const initGameServiceSocketTest = () => {
    socket = new SocketServerMock();
    socketClient = socket.clientMock;
    socket.on("connect", () => {
        socket.emit("connect");
    });
    socket.on("signin", () => {
        socket.emit("message", { userStakeLevel: { minBet: 10, maxBet: 5000 } });
        socket.emit("signedIn");
        socket.emit("message", { toGame: gameSettings.name });
    });
    socket.on("inGame", () => {
        socket.emit(gameSettings.name, {
            roundId: gameData.roundId,
            remainingTime: gameData.remainingTime,
            gameConfigs: gameData.gameConfigs,
            user: normalPlayer,
        });
    });
    catchAllListeners();
};

const catchAllListeners = () => {
    const origEmit = socketClient._emitFn;
    // @ts-ignore
    socketClient._emitFn = function () {
        origEmit.apply(this, arguments);
        const args = Array.prototype.slice.call(arguments);
        const event = args.shift();
        origEmit.apply(this, ["any", event, args]);
    };
    socketClient.on("any", (event: string, value: any) => {
        onAny(event, value);
    });
    // @ts-ignore
    socketClient.onAny = jest.fn();
};

const onAny = (event: string, value: any[]) => {
    const connectStore = container.resolve(ConnectionStore);
    connectStore.onHandleData(event, value[0]);
};

export const EmitEventToGameClient = (data, event = gameSettings.name.toLowerCase()) => {
    socket.emit(event, data);
};
export { socket as socketService, socketClient };
