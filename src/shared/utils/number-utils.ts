export namespace NumberUtils {
    export const getRandomInt = (length: number) => {
        const randomBytes = new Uint32Array(1);
        window.crypto.getRandomValues(randomBytes);
        const randomNumber = randomBytes[0];
        return Math.floor((randomNumber / 0xffffffff) * length);
    };

    export const getValueByCurrency = (value: number, playerRate: number, otherRate?: number): number => {
        if (!otherRate) {
            otherRate = 1;
        }

        return (value * otherRate) / playerRate;
    };
}
