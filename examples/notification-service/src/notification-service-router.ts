import * as express from "express";
const userRouter = express.Router();

userRouter.get("/", (req, res) => {
    res.send("this is notification service");
});

export default userRouter;
