import { PlayerSelectionHandlers } from "../../../../src/game/player-selections";
import { PlayerSelectionStore } from "../../../../src/game/player-selections";
import {StorageManager} from "../../../../src/shared/utils";

const settings = {
    chip: 2
};
jest.mock("../../../../src/shared/utils", () => {
    return {
        StorageManager: {
            get: jest.fn().mockImplementation((key, option) => settings),
            set: jest.fn(),
            remove: jest.fn()
        },
        localStorageKeys: {
            playerIngameSelections: "player-selections"
        }
    };
});


describe("InitHandlers", () => {
    it("should update store from storage", () => {
        // arrange
        let store = new PlayerSelectionStore();            
        let handler = new PlayerSelectionHandlers.InitHandlers(store); 

        // act
        handler.handle();

        // assert
        expect(store.chip).toBe(2);
    })
})

describe("ChipHandlers", () => {
    it("should update store", () => {
        // arrange
        let store = new PlayerSelectionStore();            
        let handler = new PlayerSelectionHandlers.ChipHandlers(store); 

        // act
        handler.handle(3);

        // assert
        expect(store.chip).toBe(3);
        expect(StorageManager.set).toHaveBeenCalledWith("player-selections", store);
    })
})

describe("ClearHandlers", () => {
    it("should update store", () => {
        // arrange
        let store = new PlayerSelectionStore();            
        let handler = new PlayerSelectionHandlers.ClearHandlers(store); 
        store.chip = 4;

        // act
        handler.handle();

        // assert
        expect(store.chip).toBe(0);
        expect(StorageManager.remove).toHaveBeenCalledWith("player-selections");
    })
})