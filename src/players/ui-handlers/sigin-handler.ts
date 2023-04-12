import { inject, injectable } from "inversify";
import { PlayerStore } from "../player-store";
import { SocketIOStore } from "../../socket-io";

@injectable()
export class SignInHandler {
    constructor(
        @inject(PlayerStore) protected readonly store: PlayerStore,
        @inject(SocketIOStore) protected readonly socketStore: SocketIOStore
    ) {}

    handle() {
        // TODO: why the signIn business is put in Store ???
        this.store.signIn(this.socketStore.connection);
    }
}
