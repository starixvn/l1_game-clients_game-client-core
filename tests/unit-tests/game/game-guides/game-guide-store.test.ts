import { makeAutoObservable } from "mobx";
import { GameGuideStore } from "../../../../src/game/game-guides/game-guide-store";

jest.mock("mobx");
describe("GameGuideStore", () => {
    describe("constructor", () => {
        it("should call makeAutoObservable", () => {
            // act
            const store = new GameGuideStore();

            // assert
            expect(makeAutoObservable).toHaveBeenCalledWith(store);
            expect(store.url).toBe("");
        });
        it("default url is empty string", () => {
            // act
            const store = new GameGuideStore();

            // assert
            expect(store.url).toBe("");
        });
    });
});
