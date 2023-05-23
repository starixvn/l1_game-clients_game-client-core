import { RoundRunningHandlers } from "../../../src/game/rounds";
import { container } from "../stubs/container";
import { inGameTest } from "./in-game.test";
import { connectToService, sso } from "./set-up";
import { settlementTest } from "./settlements.test";

export const gameTests = () => {
    describe("Game Tests", () => {
        let roundRunningHandler: RoundRunningHandlers;
        beforeAll(async () => {
            await sso();
            connectToService();
            roundRunningHandler = container.resolve(RoundRunningHandlers);
        });
        afterEach(() => {
            roundRunningHandler.runnerId && roundRunningHandler.stopRunner();
        });
        inGameTest();
        settlementTest();
    });
};
