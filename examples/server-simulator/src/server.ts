import express, { Application, Request, Response, NextFunction } from "express";
import * as http from "http";
import cors from "cors";
import userRouter from "./user-service-router";

const app: Application = express();
const server = http.createServer(app);

const port = 3000;

app.use(
    cors({
        origin: "*",
    })
);
app.use(express.json());
app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.send("Root route is working");
});
app.use("/user", userRouter);
app.use(express.static("public"));

server.listen(port, () => {
    console.log(`listening on *:${port}`);
});
