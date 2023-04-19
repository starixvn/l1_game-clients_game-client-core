import * as cors from "cors";
import * as express from "express";
import * as http from "http";
import userRouter from "./user-service-router";

const app = express();
const server = http.createServer(app);

const port = 3000;

app.use(
    cors({
        origin: "*",
    })
);
app.use(express.json());
app.use("/user", userRouter);
app.use(express.static("public"));

server.listen(port, () => {
    console.log(`listening on *:${port}`);
});
