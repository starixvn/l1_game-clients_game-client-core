if (process == null) {
    var process = {
        env: {
            NODE_ENV: "development",
        },
    };
}

if (global == null) {
    var global = globalThis;
}
