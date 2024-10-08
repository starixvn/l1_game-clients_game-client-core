import gc from "@sg/game-client-base";
import inversify from "inversify";

const { injectable } = inversify;

@injectable()
export class ExampleHandler {
    handle(data: unknown) {
        console.log(data);
    }

    eventHandleList = [
        {
            name: gc.GameServiceMessage.User.eventName,
            handle: this.handle,
        },
    ];
}
