import * as express from "express";
const userRouter = express.Router();

userRouter.get("/", (req, res) => {
    res.send("this is user service");
});

userRouter.get("/auth/sso", (req, res) => {
    const { system } = req.query;
    const authData = {
        isAuthenticated: true,
        isUM: false,
        language: "vi-VN",
        memberName: "QFMYQQN6",
        ss: "1-session-id",
        system: system,
        umInfo: null,
        username: "1_NormalUser",
    };
    res.send(authData);
});

userRouter.post("/auth/authorize", (req, res) => {
    const data = {
        authorized: true,
        isUM: false,
        umInfo: null,
        user: {
            UID: 1,
            name: "Scarlet95714",
            avatarId: 19,
            currency: "$US",
            red: 25000,
            fractionalOddsFormat: true,
            isDisplayPlayerCurrency: true,
            offerGames: [{ gameId: 2 }, { gameId: 7 }],
        },
    };
    res.send(data);
});

export default userRouter;
