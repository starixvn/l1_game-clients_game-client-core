import UserServiceClient from "sc-user-service-client";
import { normalPlayer } from "./player";

export let userServiceAuth;
export const initUserService = () => {
    const noUmResult = { isUM: false, umInfo: null };
    const successResponse = {
        ...noUmResult,
        errorCode: "0",
        message: "",
        isSuccessful: true,
        apiError: null,
        isDisableAccount: null,
        balance: normalPlayer.red,
        scoins: 0,
        availableSpins: 0,
        availSpins: 0,
    };
    userServiceAuth = {
        sso: jest.fn().mockReturnValue({
            ...noUmResult,
            isAuthenticated: true,
            language: normalPlayer.language,
            memberName: normalPlayer.memberName,
            ss: normalPlayer.ss,
            system: 1,
            username: normalPlayer.username,
        }),
        authorize: jest.fn().mockReturnValue({
            ...noUmResult,
            authorized: true,
            user: {
                UID: normalPlayer.UID,
                name: normalPlayer.name,
                avatarId: 19,
                currency: normalPlayer.currency,
                red: normalPlayer.red,
                scoins: 0,
                availableSpins: 0,
                fractionalOddsFormat: true,
                isDisplayPlayerCurrency: true,
                offerGames: [{ gameId: 1 }, { gameId: 7 }],
            },
        }),
        reCheckIn: jest.fn().mockReturnValue(successResponse),
    };
    // @ts-ignore
    UserServiceClient.mockImplementation(() => {
        return { auth: userServiceAuth };
    });
};
