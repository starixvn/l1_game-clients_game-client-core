import { GameServiceMessage } from "../shared";

export namespace BaccaratXServiceMessage {
    export class BaccaratOwnBets extends GameServiceMessage.OwnBets {
        fee: number;
    }
}
