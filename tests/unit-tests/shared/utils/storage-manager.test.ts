import { LocalStorage, Memory, StorageManager } from "./../../../../src/shared/utils/storage-manager";

describe("Storage Manger", () => {
    describe("LocalStorage", () => {
        let storage: LocalStorage;
        beforeEach(() => {
            storage = new LocalStorage();
        });

        // test the remove method
        test("remove should remove an item from localStorage", () => {
            // Arrange
            storage.set("foo", "bar");

            // Act
            storage.remove("foo");

            // Assert
            expect(storage.get("foo")).toBeNull();
        });

        // test the get method
        test("get should return an item from localStorage", () => {
            // Arrange
            storage.set("foo", "bar");

            // Assert
            expect(storage.get("foo")).toBe("bar");
        });

        // test the set method
        test("set should store an item in localStorage", () => {
            // Arrange
            storage.set("foo", "bar");

            // Assert
            expect(localStorage.getItem("foo")).toBe('"bar"');
        });

        // test the isAvailable method
        test("isAvailable should return true if localStorage is supported", () => {
            // Assert
            expect(storage.isAvailable()).toBe(true);
        });

        test("isAvailable should return false when browser not support local storage", () => {
            // Arrange
            const consoleLogSpy = jest.spyOn(console, "log");

            // Act
            Object.defineProperty(window, "localStorage", {
                value: {
                    setItem: jest.fn(() => {
                        throw new Error("Browser not support Local Storage");
                    }),
                },
                writable: true,
            });

            // Assert
            expect(storage.isAvailable()).toBe(false);
            expect(console.log).toHaveBeenCalledWith(expect.stringContaining("Browser not support Local Storage"));
            consoleLogSpy.mockRestore();
        });
    });

    describe("Memory", () => {
        let memory: Memory;
        beforeEach(() => {
            memory = new Memory();
        });

        // test the remove method
        test("remove should delete a property from localMemory", () => {
            // Arrange
            memory.set("foo", "bar");

            // Act
            memory.remove("foo");

            // Assert
            expect(memory.get("foo")).toBeNull();
        });

        // test the get method
        test("get should return a property from localMemory", () => {
            // Arrange
            memory.set("foo", "bar");

            // Assert
            expect(memory.get("foo")).toBe("bar");
        });

        // test the set method
        test("set should assign a property in localMemory", () => {
            // Arrange
            memory.set("foo", "bar");

            // Assert
            expect(memory.localMemory.foo).toBe("bar");
        });

        // test the isAvailable method
        test("isAvailable should return true", () => {
            // Assert
            expect(memory.isAvailable()).toBe(true);
        });
    });

    describe("StorageManager", () => {
        let mockStorage;
        beforeEach(() => {
            mockStorage = {
                get: jest.fn().mockReturnValue("bar"),
                remove: jest.fn(),
                set: jest.fn(),
                isAvailable: jest.fn().mockReturnValue(true),
            };
        });

        test("getCurrentStorage should return the best available storage", () => {
            // Arrange
            const mockLocalStorage = {
                setItem: jest.fn(),
                getItem: jest.fn(),
                removeItem: jest.fn(),
                clear: jest.fn(),
                key: jest.fn(),
                length: 0,
            };
            // Act
            global.window.localStorage = mockLocalStorage;
            // Assert
            expect(StorageManager.getCurrentStorage()).toBeInstanceOf(LocalStorage);
        });

        test("get should return data from the current storage", () => {
            // Act
            jest.spyOn(StorageManager, "getCurrentStorage").mockReturnValue(mockStorage);
            // Assert
            expect(StorageManager.get("foo")).toBe("bar");
        });

        test("set should store data in the current storage", () => {
            // Arrange
            jest.spyOn(StorageManager, "getCurrentStorage").mockReturnValue(mockStorage);
            // Act
            StorageManager.set("foo", "bar");
            // Assert
            expect(mockStorage.set).toHaveBeenCalledWith("foo", "bar");
        });

        test("remove should delete data from the current storage", () => {
            // Arrange
            jest.spyOn(StorageManager, "getCurrentStorage").mockReturnValue(mockStorage);

            // Act
            StorageManager.remove("foo");
            // Assert
            expect(mockStorage.remove).toHaveBeenCalledWith("foo");
        });
    });
});
