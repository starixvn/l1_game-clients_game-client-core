interface IActionStorage {
    remove: (name: string) => void;
    get: (name: string) => string;
    set: (name: string, value: string, expiresDay?: number) => void;
    isAvailable: () => boolean;
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

    set(name: string, value: string) {
        localStorage.setItem(name, JSON.stringify(value));
    }

    isAvailable() {
        const test = "test";
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
    remove(name: string) {
        window[name] = "";
    }

    get(name: string) {
        return window[name] ? JSON.parse(window[name]) : null;
    }

    set(name: string, value: string) {
        window[name] = JSON.stringify(value);
    }

    isAvailable() {
        return true;
    }
}

export class StorageUtils {
    static supportStorage: IActionStorage;

    static get() {
        if (!StorageUtils.supportStorage) {
            const allStorage = [new LocalStorage(), new Memory()];

            // default Memory storage always is available.
            StorageUtils.supportStorage = allStorage.filter((storage) => storage.isAvailable())[0];
        }

        return StorageUtils.supportStorage;
    }
}

export const localStorageKeys = {
    session: "auth-session",
};
