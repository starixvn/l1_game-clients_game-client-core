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
    ss: "mock-session",
    system: system,
    umInfo: null,
    username: "ONEworks1_99",
  };
  res.send(authData);
});

userRouter.post("/auth/authorize", (req, res) => {
  const data = {
    authorized: true,
    isUM: false,
    umInfo: null,
    user: {
      UID: 20037,
      name: "Scarlet95714",
      avatarId: 19,
      currency: "$US",
      red: 2000,
      fractionalOddsFormat: true,
      isDisplayPlayerCurrency: true,
      offerGames: [{ gameId: 2 }, { gameId: 7 }],
    },
  };
  res.send(data);
});

export default userRouter;
