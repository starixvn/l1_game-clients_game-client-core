const getRandomInt = (length: number) => {
    const randomBytes = new Uint32Array(1);
    window.crypto.getRandomValues(randomBytes);
    const randomNumber = randomBytes[0];
    return Math.floor((randomNumber / 0xffffffff) * length);
};

export { getRandomInt };
