import { BetHistoryHandlers, BetHistoryModel, BetHistoryStore } from "../../../../src/game/bet-history";
import { ConnectionStore } from "../../../../src/game/connection";
import { GameClientEmitMessage, GameServiceMessage, Mediator } from "../../../../src/shared";
import { gameSettings } from "../../container.test";

describe("BetHistoryPopupHandlers tests", () => {
    describe("handle", () => {
        it("should call to set store data", () => {
            const store = new BetHistoryStore();
            store.setData = jest.fn();
            const data: BetHistoryModel = {
                page: 1,
                pageSize: 8,
                total: 50,
                betLogs: [],
            };

            // arrange
            const handler = new BetHistoryHandlers.BetHistoryPopupHandlers(store);

            // act
            handler.handle(data);

            // assert
            expect(store.setData).toHaveBeenCalledWith(data);
        });
    });
});

describe("BetHistoryCallServiceHandler tests", () => {
    describe("handle", () => {
        it("should call connection store to send page data to server", () => {
            const connectionStore = new ConnectionStore(new Mediator(), gameSettings);
            connectionStore.send = jest.fn();
            const page = 1;

            // arrange
            const handler = new BetHistoryHandlers.BetHistoryCallServiceHandler(connectionStore);

            // act
            handler.handle(page);

            // assert
            expect(connectionStore.send).toHaveBeenCalledWith(GameClientEmitMessage.BetHistory.eventName, { page: 1 });
        });
    });
});
