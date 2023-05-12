import * as express from "express";
const userRouter = express.Router();

userRouter.get("/", (req, res) => {
    res.send("this is notification service");
});

// userRouter.get("/undermaintain/kickout", (req, res) => {
//     return res.send("Under Maintenance");
// });

export default userRouter;
