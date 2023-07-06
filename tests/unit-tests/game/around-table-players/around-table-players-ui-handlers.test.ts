import { AroundTablePlayersStore } from "../../../../src/game/around-table-players/around-table-players-store";
import { MaxBalanceDisplay } from "./../../../../src/game/around-table-players/around-table-players-ui-handlers";

describe("MaxBalanceDisplay", () => {
    let maxBalanceDisplay: MaxBalanceDisplay;
    let aroundTablePlayersStoreMock: Partial<AroundTablePlayersStore>;

    beforeEach(() => {
        aroundTablePlayersStoreMock = {
            updateMaxBalanceDisplay: jest.fn(),
        };

        maxBalanceDisplay = new MaxBalanceDisplay(aroundTablePlayersStoreMock as AroundTablePlayersStore);
    });

    it("should call updateMaxBalanceDisplay method of aroundTablePlayersStore", async () => {
        // Act
        await maxBalanceDisplay.handle();

        // Assert
        expect(aroundTablePlayersStoreMock.updateMaxBalanceDisplay).toHaveBeenCalled();
    });
});
