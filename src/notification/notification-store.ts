import { injectable } from "inversify";
import { GameServiceMessage } from "../shared";
import { SocketConnectionStore } from "../socket-connection";

export const NotificationEvent = {
    kickedOut: "kickedOut",
};

@injectable()
export class NotificationStore extends SocketConnectionStore {
    onConnected() {
        super.onConnected();
        this.connection.on(NotificationEvent.kickedOut, this.onHandleKickedOut.bind(this));
    }

    onHandleKickedOut(data: GameServiceMessage.UnderMaintenanceInfo) {
        this.mediator.emit(GameServiceMessage.UnderMaintenanceInfo.eventName, data);
    }
}
