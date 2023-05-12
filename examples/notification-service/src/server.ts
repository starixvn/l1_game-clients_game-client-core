import express, { Application, Request, Response, NextFunction } from "express";
import * as http from "http";
import cors from "cors";
import userRouter from "./notification-service-router";

const app: Application = express();
const server = http.createServer(app);

const port = 3008;

let io = require("socket.io")(server);
io.on("connection", function (socket: any) {
    console.log("a user connected");
});

app.use(
    cors({
        origin: "*",
    })
);
app.use(express.json());
app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.send("Notification root route is working");
});
app.use("/user", userRouter);
app.use(express.static("public"));

app.get("/kickedOut", function (req, res) {
    res.send("Under Maintenance !");
    io.emit("kickedOut", {
        message: "Game đang được bảo trì, vui lòng quay lại sau 10 phút.",
        umInfo: {
            isUM: true,
            startTime: "2023-05-12T09:43:00.000Z",
            endTime: "2023-05-12T10:43:00.000Z",
        },
    });
});

server.listen(port, () => {
    console.log(`listening on *:${port}`);
});
