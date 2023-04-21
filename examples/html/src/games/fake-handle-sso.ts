import { Shared } from "game-client-base";

const ssoResponse = {
    isAuthenticated: true,
    username: "ONEworks1_99",
    language: "vi-VN",
    session: "mock-session",
    system: "1",
    memberName: "QFMYQQN6",
    ssoTime: new Date(),
};

export const fakeResponseSSO = () => {
    Shared.utils.StorageManager.set(Shared.utils.localStorageKeys.session, ssoResponse);
    const paramsObj = { token: "mock-session" };
    const urlParams = new URLSearchParams(paramsObj);

    return { urlParams, system: ssoResponse.system };
};
