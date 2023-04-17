import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";
export interface IGameConfiguration {
    id: number;
    name: string;
    key: string;
    route?: string;
    mini?: {
        miniPanel: boolean;
        multi?: string;
    };
    remoteBundle?: {
        dependsOn: string[];
    };
}

@injectable()
export class GameConfigurationStore {
    public gameConfigurations: IGameConfiguration[];

    constructor() {
        makeAutoObservable(this);
    }

    setGameConfiguration(data: IGameConfiguration[]) {
        this.gameConfigurations = data;
    }

    getGameConfigurationWithGameId(gameId: number | string) {
        return this.gameConfigurations.find((configuration) => configuration.id === Number(gameId));
    }
}
