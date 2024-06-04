import { stub } from "jest-auto-stub";
import { MultipliersStore } from "../../../src/features/multipliers/multipliers-store";
import { BaccaratMultipliersHandler, Card } from "../../../src/game-baccaratx/baccarat-multipliers-handler";
import { BaccaratMultipliersStore } from "../../../src/game-baccaratx/baccarat-multipliers-store";
import { GameConfigStore } from "../../../src/game/game-configs/game-config-store";
describe("BaccaratMultipliersHandler", () => {
    let handler: BaccaratMultipliersHandler;
    let multipliersStore: MultipliersStore<Card>;

    let gameConfigStore: GameConfigStore;
    let baccaratMultipliersStore: BaccaratMultipliersStore<Card>;
    beforeEach(() => {
        multipliersStore = stub<MultipliersStore<Card>>();
        gameConfigStore = stub<GameConfigStore>();
        baccaratMultipliersStore = stub<BaccaratMultipliersStore<Card>>();
        handler = new BaccaratMultipliersHandler(multipliersStore, gameConfigStore, baccaratMultipliersStore);
    });
    describe("updateChoicesMultipliers", () => {
        it("should update choicesMultipliers", () => {
            //Arrange
            baccaratMultipliersStore.choicesMultipliers = {};
            const betChoice = "player";
            const multiplierValues = [2.2, 3];
            const fractionalOdds = 0.96;
            //Act
            handler.updateChoicesMultipliers(betChoice, multiplierValues, fractionalOdds);

            //Assert
            const expectedValue = fractionalOdds * multiplierValues[0] * multiplierValues[1] + 1;
            expect(baccaratMultipliersStore.choicesMultipliers[betChoice].multipliers).toEqual(multiplierValues);
            expect(baccaratMultipliersStore.choicesMultipliers[betChoice].value).toEqual(expectedValue);
        });
    });
});
