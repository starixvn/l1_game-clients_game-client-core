interface IActionStorage {
    remove: (name: string) => void;
    get: (name: string) => string | object;
    set: (name: string, value: string | object, expiresDay?: number) => void;
    isAvailable: () => boolean;
}

declare global {
    interface Window {
        localMemory: object;
    }
}

class LocalStorage implements IActionStorage {
    remove(name: string) {
        localStorage.removeItem(name);
    }

    get(name: string) {
        const storage = localStorage.getItem(name);
        try {
            return storage ? JSON.parse(storage) : null;
        } catch (error) {
            return storage ?? null;
        }
    }

    set(name: string, value: string | object) {
        localStorage.setItem(name, JSON.stringify(value));
    }

    isAvailable() {
        const test = "test storage";
        try {
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            console.log("Browser not support Local Storage");
            return false;
        }
    }
}

class Memory implements IActionStorage {
    localMemory: any;
    constructor() {
        window.localMemory = {};
        this.localMemory = window.localMemory;
    }

    remove(name: string) {
        this.localMemory[name] = "";
    }

    get(name: string) {
        return this.localMemory[name] ? JSON.parse(this.localMemory[name]) : null;
    }

    set(name: string, value: string) {
        this.localMemory[name] = JSON.stringify(value);
    }

    isAvailable() {
        return true;
    }
}

export class StorageManager {
    static supportStorage: IActionStorage;

    private static initialize() {
        if (!StorageManager.supportStorage) {
            const allStorage = [new LocalStorage(), new Memory()];
            StorageManager.supportStorage = allStorage.filter((storage) => storage.isAvailable())[0];
        }
    }

    static getCurrentStorage() {
        StorageManager.initialize();
        return StorageManager.supportStorage;
    }

    static get(name: string) {
        return StorageManager.getCurrentStorage().get(name);
    }

    static set(name: string, value: string | object) {
        StorageManager.getCurrentStorage().set(name, value);
    }

    static remove(name: string) {
        StorageManager.getCurrentStorage().remove(name);
    }
}

export const localStorageKeys = {
    session: "ss",
    directMode: "direct-mode",
    socketClients: "socket-clients",
};
