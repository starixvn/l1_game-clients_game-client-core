import gc from "game-client-base";

const USER_SERVICE_URL = "http://localhost:3000/user";
const userService = new gc.Auth.UserService(USER_SERVICE_URL);

const containerOptions: gc.IContainerOptions = {
    onContainerCreated: (container) => {
        container.bind(gc.Auth.UserService).toConstantValue(userService);
    },
    enabledFeatures: [gc.Player.FEATURE_NAME, gc.Auth.FEATURE_NAME],
};

export const container = gc.getContainer(containerOptions);
