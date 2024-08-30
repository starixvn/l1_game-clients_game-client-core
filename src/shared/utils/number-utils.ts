export namespace NumberUtils {
    export const getRandomInt = (length: number) => {
        const randomBytes = new Uint32Array(1);
        globalThis.crypto.getRandomValues(randomBytes);
        const randomNumber = randomBytes[0];
        return Math.floor((randomNumber / 0xffffffff) * length);
    };

    export const getValueByCurrency = (value: number, mainPlayerRate: number, otherPlayerRate?: number): number => {
        if (!otherPlayerRate) {
            otherPlayerRate = 1;
        }

        return (value * otherPlayerRate) / mainPlayerRate;
    };
}
