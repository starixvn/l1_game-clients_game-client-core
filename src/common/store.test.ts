import { Store } from ".";
import container, { makeObservable } from "../container.test";

describe(Store.name, () => {
  describe("constructor", () => {
    describe("when called", () => {
      it("should execute makeObservable method", () => {
        // Act
        const store = container.resolve(Store);

        // Assert
        expect(makeObservable).toBeCalledWith(store);
      });
    });
  });
});
