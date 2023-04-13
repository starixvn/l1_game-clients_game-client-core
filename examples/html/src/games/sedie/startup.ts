import { Auth, GameConfigs, IContainerOptions, getContainer } from "game-client-base";
import * as mobx from "mobx";
import Observer from "observer";
import { userService } from "../../user-service";
import { SedieGameController } from "./sedie-game-controller";

const gameSetting: GameConfigs.GameSetting = {
    id: 1,
    name: "SeDie",
    durations: {
        wholeRound: 39,
        lockingBet: 5,
        placingBet: 30,
    },
};

const containerOptions: IContainerOptions = {
    onContainerCreated: (container) => {
        container.bind(GameConfigs.GameSetting).toConstantValue(gameSetting);
        container.bind(Auth.UserService).toConstantValue(userService);
    },
};

const container = getContainer(containerOptions);
const controller = new SedieGameController(container);

Observer.configure({ sedie: { mobx, container } });

controller.start();
