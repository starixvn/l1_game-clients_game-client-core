import { registerModule } from "../../src/common";

describe(registerModule.name, () => {
  describe("when called", () => {
    it("should call resolve method of the container instance", () => {
      // Arrange
      const container = {
        resolve: jest.fn(),
      };

      const module = class Module {};

      // Act
      registerModule(container, module);

      // Assert
      expect(container.resolve).toBeCalledWith(module);
    });
  });
});
