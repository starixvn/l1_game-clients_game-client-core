import gc from "game-client-base";
import inversify from "inversify";

const { injectable, inject } = inversify;

@injectable()
export class JoinRoomHandler implements gc.Shared.IHandler<string> {
    @inject(gc.Connection.ConnectionStore)
    protected readonly connectionStore: gc.Connection.ConnectionStore;

    handle(gameName: string) {
        this.connectionStore.send("joinRoom", gameName);
    }
}
