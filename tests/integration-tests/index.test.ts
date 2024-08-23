import { io } from "socket.io-client/dist/socket.io.js";
import { gameTests } from "./game-tests";
import { ssoTests } from "./sso.test";
import { initGameServiceSocketTest, socketClient } from "./stubs/connection";
import { initContainer } from "./stubs/container";
import { initUserService } from "./stubs/user-service";

const now = new Date("2023-01-01");
jest.useFakeTimers().setSystemTime(now);
jest.mock("@sg/sg-user-service-client");
jest.mock("socket.io-client/dist/socket.io.js", () => {
    return { io: jest.fn() };
});
describe("Game Client Base Integration Tests", () => {
    beforeAll(() => {
        initGameServiceSocketTest();
        initUserService();
        io.mockImplementation(() => socketClient);
        initContainer();
    });
    ssoTests();
    gameTests();
});
