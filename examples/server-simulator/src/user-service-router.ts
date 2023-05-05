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

userRouter.post("/settings", (req, res) => {
    const data = {
        chips: [
            {
                time: "0001-01-01T00:00:00.000Z",
                text: "1",
                value: 1,
                color: "#848484",
            },
            {
                time: "0001-01-01T00:00:00.000Z",
                text: "2",
                value: 2,
                color: "#a335a7",
            },
            {
                time: "0001-01-01T00:00:00.000Z",
                text: "5",
                value: 5,
                color: "#2cb400",
            },
            {
                time: "0001-01-01T00:00:00.000Z",
                text: "10",
                value: 10,
                color: "#ff930d",
            },
            {
                time: "0001-01-01T00:00:00.000Z",
                text: "100",
                value: 100,
                color: "#1477ff",
            },
            {
                time: "0001-01-01T00:00:00.000Z",
                text: "200",
                value: 200,
                color: "#10e3ff",
            },
            {
                time: "0001-01-01T00:00:00.000Z",
                text: "500",
                value: 500,
                color: "#ff3818",
            },
            {
                time: "0001-01-01T00:00:00.000Z",
                text: "1K",
                value: 1000,
                color: "#193c66",
            },
            {
                time: "0001-01-01T00:00:00.000Z",
                text: "2K",
                value: 2000,
                color: "#8c6f01",
            },
            {
                time: "0001-01-01T00:00:00.000Z",
                text: "3K",
                value: 3000,
                color: "#222222",
            },
            {
                time: "0001-01-01T00:00:00.000Z",
                text: "5K",
                value: 5000,
                color: "#be000b",
            },
            {
                time: "0001-01-01T00:00:00.000Z",
                text: "10K",
                value: 10000,
                color: "#7b004b",
            },
            {
                time: "0001-01-01T00:00:00.000Z",
                text: "20K",
                value: 20000,
                color: "#007866",
            },
            {
                time: "0001-01-01T00:00:00.000Z",
                text: "50",
                value: 50,
                color: "#ff48e4",
            },
            {
                time: "0001-01-01T00:00:00.000Z",
                text: "30K",
                value: 30000,
                color: "#e93a3a",
            },
            {
                time: "0001-01-01T00:00:00.000Z",
                text: "3",
                value: 3,
                color: "#000000",
            },
        ],
    };
    res.send(data);
});

export default userRouter;
