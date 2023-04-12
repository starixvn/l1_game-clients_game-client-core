import { inject, injectable } from "inversify";
import { GameServiceMessage, IMultipleHandlers } from "../shared";
import { PlayerStore } from "./player-store";

@injectable()
export class PlayerHandlers implements IMultipleHandlers {
    constructor(@inject(PlayerStore) protected readonly store: PlayerStore) {}

    handleStakeLevel(stakeLevel: GameServiceMessage.UserStakeLevel) {
        this.store.setStakeLevel(stakeLevel);
    }

    handlePlayerProfile(profile: GameServiceMessage.User) {
        profile?.name && (this.store.name = profile.name);
        profile?.red && (this.store.balance = profile.red);
        profile?.avatarId && (this.store.avatarId = profile.avatarId);
    }

    eventHandleList = [
        {
            name: GameServiceMessage.UserStakeLevel.eventName,
            handle: this.handleStakeLevel.bind(this)
        },
        {
            name: GameServiceMessage.User.eventName,
            handle: this.handlePlayerProfile.bind(this)
        }
    ];
}
