import * as compose from "docker-compose";
import * as path from "path";

const RunDockerCompose = async () => {
    console.log("\x1b[36m%s\x1b[0m", "Compose down process.....");
    await compose.down({ cwd: path.join(__dirname) }).then(
        () => {
            console.log("\x1b[36m%s\x1b[0m", "Compose down done.");
        },
        (err) => {
            console.log("\x1b[36m%s\x1b[0m", "something went wrong:", err.message);
        }
    );

    console.log("\x1b[33m%s\x1b[0m", "-----------");
    console.log("\x1b[33m%s\x1b[0m", "Compose up process.....");
    await compose.upAll({ cwd: path.join(__dirname), log: true }).then(
        () => {
            console.log("\x1b[33m%s\x1b[0m", "Compose Up done.");
        },
        (err) => {
            console.log("\x1b[33m%s\x1b[0m", "something went wrong:", err.message);
        }
    );
};

RunDockerCompose();
