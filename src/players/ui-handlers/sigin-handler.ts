import { inject, injectable } from "inversify";
import { PlayerStore } from "../player-store";
import { SocketIOStore } from "../../socket-io";
import { GameClientEmitMessage } from "../../shared";

@injectable()
export class SignInHandler {
    constructor(
        @inject(PlayerStore) protected readonly store: PlayerStore,
        @inject(SocketIOStore) protected readonly socketStore: SocketIOStore
    ) {}

    handle() {
        const signIn = new GameClientEmitMessage.Signin();
        signIn.username = this.store.name;
        signIn.ss = this.store.ss;
        // signIn.ss = this.authStore.ss;
        this.socketStore.connection.emit(GameClientEmitMessage.Signin.eventName, signIn);
    }
}
