import { Server } from "socket.io";
import { SedieGameService } from "./sedie-game-service";
import { DragonTigerGameService } from "./dragon-tiger-game-service";

export const player = {
    UID: 20037,
    name: "Scarlet95714",
    avatarId: 19,
    currency: "$US",
    red: 2000,
    rate: 1,
};

export class PlayerService {
    constructor(private io: Server, private sedieGameService: SedieGameService, private dragonTigerGameService: DragonTigerGameService) {}

    onSignIn(socket, message: any) {
        const player = {
            user: {
                red: 10000,
                avatarId: 1,
            },
            userStakeLevel: { minBet: 10, maxBet: 15 },
        };

        if (socket.rooms.has(SedieGameService.gameName.toLocaleLowerCase())) {
            console.log(message);
            this.sedieGameService.sendPlayerInformation(player, socket);
        }

        if (socket.rooms.has(DragonTigerGameService.gameName.toLocaleLowerCase())) {
            console.log(message);
            this.dragonTigerGameService.sendPlayerInformation(player, socket);
        }
    }

    onInGame(socket) {
        if (socket.rooms.has(SedieGameService.gameName.toLocaleLowerCase())) {
            this.sedieGameService.sendInGame(socket);
        }

        if (socket.rooms.has(DragonTigerGameService.gameName.toLocaleLowerCase())) {
            this.dragonTigerGameService.sendInGame(socket);
        }
    }
}
