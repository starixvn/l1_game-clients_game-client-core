import * as express from "express";
const userRouter = express.Router();

userRouter.get("/", (req, res) => {
    res.send("this is user service");
});

userRouter.get("/auth/sso", (req, res) => {
    const { system, token } = req.query;
    if (token === "testum") {
        return res.send({
            isAuthenticated: false,
            isUM: true,
            umInfo: {
                startTime: "2023-05-08T03:54:00.000Z",
                endTime: "2023-05-08T04:54:00.000Z",
            },
            language: "vi-VN",
            memberName: "QFMYQQN6",
            ss: "1-session-id",
            system: system,
            username: "1_NormalUser",
        });
    }

    return res.send({
        isAuthenticated: true,
        isUM: false,
        umInfo: null,
        language: "vi-VN",
        memberName: "QFMYQQN6",
        ss: "1-session-id",
        system: system,
        username: "1_NormalUser",
    });
});

userRouter.post("/auth/authorize", (req, res) => {
    const data = {
        authorized: true,
        isUM: false,
        umInfo: null,
        user: null,
    };
    res.send(data);
});

userRouter.post("/auth/reCheckIn", (req, res) => {
    const data = {
        errorCode: "0",
        message: "",
        umInfo: null,
        isSuccessful: true,
        isUM: false,
        balance: 2000,
        scoins: 0,
        availableSpins: 0,
        apiError: null,
        availSpins: 0,
        isDisableAccount: null,
    };
    res.send(data);
});

userRouter.post("/auth/signName", (req, res) => {
    const { nickname } = req.body;
    const data = {
        authorized: true,
        isUM: false,
        umInfo: null,
        user: {
            UID: 1,
            name: nickname,
            avatarId: 19,
            currency: "$US",
            red: 25000,
            scoins: 0,
            availableSpins: 0,
            fractionalOddsFormat: true,
            isDisplayPlayerCurrency: true,
            offerGames: [{ gameId: 2 }, { gameId: 7 }],
        },
    };
    res.send(data);
});

export default userRouter;
